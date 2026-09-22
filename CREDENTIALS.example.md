# HackMe'26 Admin Panel Credentials

> ⚠️ **IMPORTANT**: This is a template file. The actual credentials are stored securely and should never be committed to the repository.

## Admin Panel Access

The admin panel requires authentication to access operations dashboard.

### How to Get Credentials

Contact one of the following team leads for admin access:

- **Sabeel**: 91882 68972
- **Parthiv**: 85476 37499
- **Nandhana**: 70125 87783

### Login Page

Access the admin panel at:
- Development: http://localhost:5174
- Production: https://admin.hackme26.com (if deployed)

### Security Notes

1. **Never share credentials** via email, chat, or public channels
2. **Never commit** credentials to git repository
3. **Change default credentials** before production deployment
4. **Use HTTPS** in production environment
5. **Rotate credentials** periodically

---

## For Team Leads Only

To update credentials, modify the authentication logic in:
- `admin/src/services/api.js` (authApi.login function)

Current implementation uses hardcoded validation for simplicity. For production, implement:
- Database-backed user authentication
- JWT token generation with expiry
- Password hashing (bcrypt/argon2)
- Role-based access control (RBAC)
- Multi-factor authentication (MFA) optional

---

**© 2026 HackMe'26 • Keep credentials secure!**
