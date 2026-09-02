# 03 - Software Requirements Specification (SRS)

## 1. Functional Requirements
- **FR1 (Custom Chits)**: Host must be able to add, edit, and delete chit types (1–30 chars).
- **FR2 (4x Pool)**: Server must generate 4 physical items with unique UUIDs per configured chit type.
- **FR3 (Room Management)**: 5-character alphanumeric room codes (`A7K9P`), socket room isolation, host delegation upon host disconnect.
- **FR4 (Server Authority)**: Client never decides matches, turn order, or scores. Unrevealed chit identities are strictly withheld from client state.
- **FR5 (Real-Time Communication)**: Bi-directional WebSocket events with reconnection support.
- **FR6 (Cross-Platform UI)**: Responsive layout supporting mobile touch screens, tablets, and desktop resolutions.

## 2. Non-Functional Requirements
- **Performance**: Move resolution under 50ms latency.
- **Security**: Strict rate limiting, input sanitization, and no leaked board data in responses.
- **Reliability**: In-memory database fallback ensuring offline/local operation if MongoDB is unavailable.
