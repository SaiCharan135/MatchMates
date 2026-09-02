# 11 - Testing & Quality Assurance

## 1. Automated Unit Tests
The backend test suite is executed using:
```bash
npm run test:server
```
or
```bash
node server/tests/customChitsEngine.test.js
```

### Verified Test Cases:
1. **Test 1**: Custom chits registered with automatic quantity = 4.
2. **Test 2**: Case-insensitive duplicate name rejection.
3. **Test 3**: Minimum 4 chit types enforcement (<4 rejected).
4. **Test 4**: Host permissions (non-host modifications prohibited).
5. **Test 5**: Unique physical IDs generated for all chits in the 4x pool.
6. **Test 6**: Server-side match resolution with arbitrary custom text.
7. **Test 7**: Game restart with new custom chit sets.

## 2. Frontend Build Verification
```bash
npm run build
```
Builds client bundles with zero syntax or compilation errors.
