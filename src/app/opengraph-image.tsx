import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PakAiVerse - AI Development Agency";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ request }: { request: Request }) {
  const url = new URL(request.url);
  const baseUrl = url.origin;

  return new ImageResponse(
    (
      <div
        style={{
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={`${baseUrl}/projects/Main-logo.png`}
          alt="PakAiVerse Logo"
          style={{ width: 800, objectFit: "contain" }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
