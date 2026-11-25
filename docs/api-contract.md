# MadreseYar API Contract (v0 - Portal)

This document defines the initial frontend↔backend contract for portal data.  
**Status:** draft for implementation (in-memory backend first, DB later).  
**Auth:** cookie-based session (`madreseyar_session`, HttpOnly). All `/api/portal/*` endpoints require an authenticated session.

## Conventions

- Base URL: same origin (`/api/...`) or `VITE_API_BASE_URL`
- Auth transport: `credentials: include`
- Content type: `application/json; charset=utf-8`
- Success response: `{ "ok": true, ... }`
- Error response: `{ "ok": false, "reason": string, "message": string }`
- Dates/times: Persian display strings currently used by UI (e.g. `۱۴۰۵/۰۹/۰۳`) until DB/date normalization phase.
- Authorization: role-based; server must enforce role ownership. Client role checks are UX only.

## Auth (existing)

### POST `/api/auth/login`
Request:
```json
{ "role": "student|teacher|admin", "username": "string", "password": "string" }
```
Success 200:
```json
{
  "ok": true,
  "role": "teacher",
  "mode": "api",
  "user": { "username": "teacher", "role": "teacher", "displayName": "دبیر" }
}
```
Errors: `400 invalid_role|invalid_payload`, `401 invalid_credentials`

### GET `/api/auth/me`
Success 200: same shape as login (without password), from active session.  
Errors: `401 unauthorized`

### POST `/api/auth/logout`
Success 200: `{ "ok": true }`

## Portal Bootstrap

### GET `/api/portal/bootstrap`
Returns role-specific portal data for the authenticated user.

Success 200:
```json
{
  "ok": true,
  "role": "student|teacher|admin",
  "data": { /* role-specific payload */ }
}
```

Role payloads:

#### student
```json
{
  "profile": { "name": "string", "className": "string", "nationalId": "string", "phone": "string" },
  "schedule": [{ "day": "شنبه", "items": ["..."] }],
  "homework": [{ "id": "hw-1", "title": "", "subject": "", "due": "", "status": "pending|submitted|late", "teacher": "", "note": "" }],
  "grades": [{ "id": "gr-1", "subject": "", "assessment": "", "date": "", "score": 19, "outOf": 20, "status": "" }],
  "messages": [{ "id": "msg-1", "title": "", "from": "", "date": "", "body": "", "read": false }]
}
```

#### teacher
```json
{
  "profile": { "name": "string", "lesson": "string", "phone": "string" },
  "schedule": [{ "day": "", "items": [""] }],
  "attendance": { "className": "هشتم پویش", "date": "۱۴۰۵/۰۹/۰۱", "students": [{ "id": "att-1", "name": "", "status": "present|absent|late" }] },
  "grades": [{ "id": "tg-1", "student": "", "className": "", "assessment": "", "date": "", "score": "۱۹|-|—", "outOf": 20 }],
  "homework": [{ "id": "th-1", "title": "", "className": "", "due": "", "status": "active|review|closed", "submissions": "18/24" }],
  "messages": [{ "id": "tm-1", "title": "", "from": "", "date": "", "body": "", "read": false }]
}
```

#### admin
```json
{
  "profile": { "name": "string", "roleTitle": "مدیر مدرسه", "phone": "string" },
  "students": [{ "id": "st-1", "name": "", "className": "", "average": "", "status": "active|leave|transferred", "contact": "" }],
  "classes": [{ "id": "cl-1", "name": "", "grade": "", "teacher": "", "students": 24, "schedule": "", "status": "active|inactive" }],
  "announcements": [{ "id": "an-1", "title": "", "audience": "", "date": "", "status": "sent|draft", "body": "" }],
  "reports": [{ "id": "rp-1", "title": "", "type": "", "period": "", "status": "ready|in-progress", "summary": "" }]
}
```

## Mutations (v0, in-memory)

All mutations require auth and role authorization. Responses return updated resource or updated collection fragment.

### Student
- `POST /api/portal/student/homework/:id/submit`  
  Body: `{ "note"?: string }`  
  Result: `{ ok: true, item }` with `status: "submitted"`
- `PATCH /api/portal/student/messages/:id/read`  
  Result: `{ ok: true, item }`

### Teacher
- `PUT /api/portal/teacher/attendance`  
  Body: `{ "className": string, "date": string, "students": [{ "id": string, "status": "present|absent|late" }] }`  
  Result: `{ ok: true, attendance }`
- `PATCH /api/portal/teacher/grades/:id`  
  Body: `{ "score": string, "outOf": 5|10|20 }`  
  Result: `{ ok: true, item }`
- `POST /api/portal/teacher/homework`  
  Body: `{ "title": string, "className": string, "due": string }`  
  Result: `{ ok: true, item }`
- `PATCH /api/portal/teacher/messages/:id/read`  
  Result: `{ ok: true, item }`

### Admin
- `POST /api/portal/admin/students` Body: `{ "name","className","contact" }` -> `{ ok, item }`
- `PATCH /api/portal/admin/students/:id` Body: partial fields -> `{ ok, item }`
- `DELETE /api/portal/admin/students/:id` -> `{ ok: true, id }`
- `POST /api/portal/admin/classes` Body: `{ "name","grade","teacher" }` -> `{ ok, item }`
- `PATCH /api/portal/admin/classes/:id` -> `{ ok, item }`
- `DELETE /api/portal/admin/classes/:id` -> `{ ok: true, id }`
- `POST /api/portal/admin/announcements` Body: `{ "title","audience","body","status?":"draft|sent" }` -> `{ ok, item }`
- `PATCH /api/portal/admin/announcements/:id` -> `{ ok, item }`
- `POST /api/portal/admin/reports/:id/refresh` (demo action) -> `{ ok, item }`

## Error Reasons

- `unauthorized` (401) - no valid session
- `forbidden` (403) - session role not allowed
- `not_found` (404) - resource missing
- `invalid_payload` (400) - validation failed
- `api_error` (500) - unexpected server error

## Migration Notes

- v0 backend stores data in-memory (resets on server restart). This is intentional before DB.
- Frontend keeps mock mode as default and fallback baseline.
- When moving to DB, keep endpoint shapes stable where possible; add versioning only if needed.