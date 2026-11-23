import sys
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_phase1_flow():
    print("=" * 60)
    print("LEARNWISE PHASE 1: BACKEND AUTH & RBAC VERIFICATION")
    print("=" * 60)

    # 1. Health check
    res = client.get("/")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASS] 1. API Health Check OK:", res.json())

    # 2. Admin Login with Seeded Credentials
    admin_login_res = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": settings.FIRST_SUPERUSER_PASSWORD
        }
    )
    assert admin_login_res.status_code == 200, f"Admin login failed: {admin_login_res.text}"
    admin_token = admin_login_res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    print("[PASS] 2. Admin Authenticated Successfully. JWT Token issued.")

    # 3. Register a Student
    student_payload = {
        "email": "student1@learnwise.edu",
        "full_name": "Alice Smith",
        "role": "STUDENT",
        "password": "StudentPassword@123"
    }
    student_reg_res = client.post(f"{settings.API_V1_STR}/auth/register", json=student_payload)
    assert student_reg_res.status_code == 201, f"Student registration failed: {student_reg_res.text}"
    assert student_reg_res.json()["requires_approval"] is False
    print("[PASS] 3. Student Registered (Immediate Approval):", student_payload["email"])

    # 4. Student Login
    student_login_res = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": student_payload["email"], "password": student_payload["password"]}
    )
    assert student_login_res.status_code == 200, f"Student login failed: {student_login_res.text}"
    student_token = student_login_res.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}
    print("[PASS] 4. Student Logged In Successfully.")

    # Verify Student cannot access Admin endpoints (RBAC check)
    forbidden_res = client.get(f"{settings.API_V1_STR}/admin/users", headers=student_headers)
    assert forbidden_res.status_code == 403, f"Expected 403 Forbidden for Student accessing Admin API, got {forbidden_res.status_code}"
    print("[PASS] 5. RBAC Guard Verified: Student blocked from Admin API (403 Forbidden).")

    # 5. Register a Faculty Account (Should require approval)
    faculty_payload = {
        "email": "dr.robert@learnwise.edu",
        "full_name": "Dr. Robert Vance",
        "role": "FACULTY",
        "password": "FacultyPassword@123"
    }
    faculty_reg_res = client.post(f"{settings.API_V1_STR}/auth/register", json=faculty_payload)
    assert faculty_reg_res.status_code == 201, f"Faculty registration failed: {faculty_reg_res.text}"
    faculty_data = faculty_reg_res.json()
    assert faculty_data["requires_approval"] is True, "Faculty must require admin approval!"
    faculty_id = faculty_data["user"]["id"]
    print(f"[PASS] 6. Faculty Registered with Pending Approval: {faculty_payload['email']} (ID: {faculty_id})")

    # 6. Faculty Login Attempt Before Approval (Must be rejected with 403)
    faculty_unapproved_login = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": faculty_payload["email"], "password": faculty_payload["password"]}
    )
    assert faculty_unapproved_login.status_code == 403, f"Expected 403 for unapproved faculty, got {faculty_unapproved_login.status_code}"
    print("[PASS] 7. Unapproved Faculty Blocked from Login (403 Forbidden - Approval Pending).")

    # 7. Admin Views Pending Approvals
    pending_res = client.get(f"{settings.API_V1_STR}/admin/faculty/pending", headers=admin_headers)
    assert pending_res.status_code == 200
    pending_list = pending_res.json()
    assert any(p["faculty_id"] == faculty_id for p in pending_list), "Registered faculty must appear in pending list"
    print(f"[PASS] 8. Admin Listed Pending Faculty ({len(pending_list)} pending application(s)).")

    # 8. Admin Approves the Faculty Account
    approve_res = client.post(
        f"{settings.API_V1_STR}/admin/faculty/{faculty_id}/approve",
        headers=admin_headers,
        json={"remarks": "Credentials verified with Department of Computer Science."}
    )
    assert approve_res.status_code == 200, f"Faculty approval failed: {approve_res.text}"
    assert approve_res.json()["status"] == "APPROVED"
    print("[PASS] 9. Admin Approved Faculty Account Successfully.")

    # 9. Faculty Login Attempt After Approval (Must now succeed!)
    faculty_approved_login = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": faculty_payload["email"], "password": faculty_payload["password"]}
    )
    assert faculty_approved_login.status_code == 200, f"Faculty login failed after approval: {faculty_approved_login.text}"
    faculty_token = faculty_approved_login.json()["access_token"]
    faculty_headers = {"Authorization": f"Bearer {faculty_token}"}
    print("[PASS] 10. Approved Faculty Logged In Successfully. JWT Bearer token issued.")

    # 10. Verify /me endpoint for Faculty
    me_res = client.get(f"{settings.API_V1_STR}/auth/me", headers=faculty_headers)
    assert me_res.status_code == 200
    assert me_res.json()["is_approved"] is True
    print("[PASS] 11. Faculty Profile Verified (/auth/me):", me_res.json()["full_name"])

    # 11. Admin Platform Stats
    stats_res = client.get(f"{settings.API_V1_STR}/admin/stats", headers=admin_headers)
    assert stats_res.status_code == 200
    print("[PASS] 12. Admin Stats Verified:", stats_res.json())

    print("\nALL 12 BACKEND AUTOMATED TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_phase1_flow()
