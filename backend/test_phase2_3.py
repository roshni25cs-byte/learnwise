import sys
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def test_phase2_3_flow():
    print("=" * 60)
    print("LEARNWISE PHASES 2 & 3: COURSE, BLOOM'S CLO, ASSESSMENT & AUTO-GRADING")
    print("=" * 60)

    # 1. Faculty Login
    faculty_login = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": "dr.robert@learnwise.edu", "password": "FacultyPassword@123"}
    )
    assert faculty_login.status_code == 200, f"Faculty login failed: {faculty_login.text}"
    faculty_token = faculty_login.json()["access_token"]
    faculty_headers = {"Authorization": f"Bearer {faculty_token}"}
    print("[PASS] 1. Faculty Authenticated successfully.")

    # 2. Faculty Creates Course
    course_payload = {
        "code": "CS302",
        "title": "Advanced Relational Data & Cognitive Architecture",
        "description": "Comprehensive study of relational algebra, indexing, B-Trees, and distributed storage."
    }
    course_res = client.post(f"{settings.API_V1_STR}/courses/", json=course_payload, headers=faculty_headers)
    assert course_res.status_code in [201, 400], f"Course creation failed: {course_res.text}"
    if course_res.status_code == 201:
        course_id = course_res.json()["id"]
    else:
        # Fetch existing
        courses = client.get(f"{settings.API_V1_STR}/courses/").json()
        course_id = next(c["id"] for c in courses if c["code"] == "CS302")
    print(f"[PASS] 2. Course Verified: CS302 (ID: {course_id})")

    # 3. Faculty Defines 6 CLOs Mapped to Bloom's 6 Cognitive Levels
    blooms_mapping = [
        ("CLO 1", "Define relational schema, keys, and functional dependencies.", "REMEMBER"),
        ("CLO 2", "Explain relational algebra projections, selections, and join equivalence.", "UNDERSTAND"),
        ("CLO 3", "Construct normalized DDL and multi-table DML transactions.", "APPLY"),
        ("CLO 4", "Deconstruct query execution plans to identify bottlenecks and index scans.", "ANALYSE"),
        ("CLO 5", "Evaluate B-Tree vs Hash index trade-offs and horizontal sharding.", "EVALUATE"),
        ("CLO 6", "Synthesize a fault-tolerant distributed transactional database architecture.", "CREATE"),
    ]

    clo_ids = {}
    for code, desc, level in blooms_mapping:
        clo_res = client.post(
            f"{settings.API_V1_STR}/courses/{course_id}/clos",
            json={"code": code, "description": desc, "blooms_level": level},
            headers=faculty_headers
        )
        assert clo_res.status_code == 200, f"CLO definition failed for {code}: {clo_res.text}"
        clo_ids[code] = clo_res.json()["id"]
        print(f"[PASS] - Bloom's Mapped CLO Created: {code} [{level}]")

    print("[PASS] 3. All 6 Bloom's Taxonomy Cognitive Levels Successfully Mapped to CLOs.")

    # 4. Student Registers & Enrolls
    student_login = client.post(
        f"{settings.API_V1_STR}/auth/login",
        json={"email": "student1@learnwise.edu", "password": "StudentPassword@123"}
    )
    assert student_login.status_code == 200
    student_token = student_login.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}

    enroll_res = client.post(f"{settings.API_V1_STR}/courses/{course_id}/enroll", headers=student_headers)
    assert enroll_res.status_code == 200, f"Enrollment failed: {enroll_res.text}"
    print("[PASS] 4. Student Enrolled in Course CS302.")

    # 5. Gemini AI Question Generation
    ai_gen_res = client.post(
        f"{settings.API_V1_STR}/ai/generate-questions",
        json={
            "course_id": course_id,
            "clo_id": clo_ids["CLO 4"],
            "question_type": "MCQ",
            "difficulty": "MEDIUM",
            "count": 2
        },
        headers=faculty_headers
    )
    assert ai_gen_res.status_code == 200, f"AI Generation failed: {ai_gen_res.text}"
    generated_questions = ai_gen_res.json()
    assert len(generated_questions) == 2
    print(f"[PASS] 5. Gemini AI Generated {len(generated_questions)} Structured Questions mapped to CLO 4 [ANALYSE].")

    # 6. Faculty Creates Assessment
    assessment_payload = {
        "course_id": course_id,
        "title": "CS302 Cognitive Assessment: Relational Architecture",
        "instructions": "Attempt all objective questions. Time limit: 30 minutes.",
        "duration_minutes": 30,
        "total_marks": 10.0,
        "passing_marks": 4.0
    }
    assess_res = client.post(f"{settings.API_V1_STR}/assessments/", json=assessment_payload, headers=faculty_headers)
    assert assess_res.status_code == 201, f"Assessment creation failed: {assess_res.text}"
    assessment_id = assess_res.json()["id"]
    print(f"[PASS] 6. Assessment Created: '{assessment_payload['title']}' (ID: {assessment_id})")

    # 7. Add Questions to Assessment
    q1_payload = {
        "clo_id": clo_ids["CLO 1"],
        "blooms_level": "REMEMBER",
        "question_type": "MCQ",
        "difficulty": "EASY",
        "prompt": "Which SQL constraint ensures unique non-null values across candidate attributes?",
        "marks": 5.0,
        "explanation": "UNIQUE constraint guarantees distinct attribute values.",
        "options": [
            {"option_text": "FOREIGN KEY", "is_correct": False, "order_index": 0},
            {"option_text": "UNIQUE", "is_correct": True, "order_index": 1},
            {"option_text": "CHECK", "is_correct": False, "order_index": 2},
        ]
    }
    q1_res = client.post(f"{settings.API_V1_STR}/assessments/{assessment_id}/questions", json=q1_payload, headers=faculty_headers)
    assert q1_res.status_code == 200
    q1_data = q1_res.json()
    q1_id = q1_data["id"]
    correct_opt_id = next(opt["id"] for opt in q1_data["options"] if opt["is_correct"])

    q2_payload = {
        "clo_id": clo_ids["CLO 4"],
        "blooms_level": "ANALYSE",
        "question_type": "MCQ",
        "difficulty": "MEDIUM",
        "prompt": "Why does a query optimizer revert to sequential scan over a secondary index?",
        "marks": 5.0,
        "explanation": "High selectivity threshold makes sequential I/O cheaper than random page fetches.",
        "options": [
            {"option_text": "Large fraction of table rows match predicate", "is_correct": True, "order_index": 0},
            {"option_text": "Database ran out of disk inodes", "is_correct": False, "order_index": 1},
        ]
    }
    q2_res = client.post(f"{settings.API_V1_STR}/assessments/{assessment_id}/questions", json=q2_payload, headers=faculty_headers)
    assert q2_res.status_code == 200
    q2_data = q2_res.json()
    q2_id = q2_data["id"]
    wrong_opt_id = next(opt["id"] for opt in q2_data["options"] if not opt["is_correct"])

    # 8. Publish Assessment
    pub_res = client.post(f"{settings.API_V1_STR}/assessments/{assessment_id}/publish", headers=faculty_headers)
    assert pub_res.status_code == 200
    assert pub_res.json()["is_published"] is True
    print("[PASS] 7. Assessment Published with 2 Questions mapped to Bloom Levels [REMEMBER & ANALYSE].")

    # 9. Student Submits Assessment
    submission_payload = {
        "answers": [
            {"question_id": q1_id, "selected_option_id": correct_opt_id}, # Correct (5/5)
            {"question_id": q2_id, "selected_option_id": wrong_opt_id},   # Wrong (0/5)
        ]
    }
    submit_res = client.post(f"{settings.API_V1_STR}/assessments/{assessment_id}/submit", json=submission_payload, headers=student_headers)
    assert submit_res.status_code == 200, f"Submission failed: {submit_res.text}"
    sub_data = submit_res.json()

    # 10. Automated Grading Verification
    assert sub_data["total_score"] == 5.0, f"Expected 5.0, got {sub_data['total_score']}"
    assert sub_data["max_score"] == 10.0, f"Expected 10.0, got {sub_data['max_score']}"
    assert sub_data["percentage"] == 50.0, f"Expected 50.0%, got {sub_data['percentage']}%"
    print(f"[PASS] 8. Auto-Grading Engine Evaluated Submission: {sub_data['total_score']} / {sub_data['max_score']} Marks ({sub_data['percentage']}%)")

    print("\nALL PHASES 2 & 3 AUTOMATED TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_phase2_3_flow()
