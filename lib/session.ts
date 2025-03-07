import "server-only";
import { SignJWT, jwtVerify} from "jose"

const secretKey = process.env.SESSION_SECRET;
const encodeKey = new TextEncoder().encode(secretKey);

type SessionPayload = {
    userId: string;
    expiresAt: Date;
};

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: "HS256"})
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt.getTime())
        .sign(encodeKey);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload} = await jwtVerify(session, encodeKey, {algorithms: ["HS256"]});
        return payload; 
    } catch (error) {
        console.error('Failed to verify session due to error: ', error);
    }
}