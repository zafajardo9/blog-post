import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.NEXT_PRIVATE_IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,


});

export async function GET() {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        // console.log("Auth parameters generated:", authenticationParameters);
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.error("Error generating auth parameters:", error);
        return NextResponse.json({ error: "Failed to generate auth parameters" }, { status: 500 });
    }
}