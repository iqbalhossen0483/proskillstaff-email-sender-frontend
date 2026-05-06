import type { LayoutAContent } from "@/types/layouts";
import Image from "next/image";

interface Props {
  content: LayoutAContent;
}

export function LayoutAPreview({ content }: Props) {
  const headerBg = content.headerBgColor || "#2563EB";

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#F9FAFB",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 8,
          maxWidth: 600,
          margin: "0 auto",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,.08)",
        }}
      >
        {/* Header */}
        <div style={{ background: headerBg, padding: "32px 40px" }}>
          <p
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            {content.companyName || "Company Name"}
          </p>
          {content.tagline && (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 14,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {content.tagline}
            </p>
          )}
        </div>

        <div style={{ padding: "32px 40px" }}>
          {/* Body paragraphs */}
          {content.bodyParagraphs?.map((p, i) => (
            <p
              key={i}
              style={{
                margin: "0 0 16px",
                fontSize: 15,
                color: "#374151",
                lineHeight: 1.6,
              }}
            >
              {p}
            </p>
          ))}

          {/* CTA */}
          {content.ctaLabel && content.ctaUrl && (
            <div style={{ textAlign: "center", margin: "24px 0" }}>
              <a
                href={content.ctaUrl}
                style={{
                  background: headerBg,
                  color: "#ffffff",
                  padding: "12px 28px",
                  borderRadius: 6,
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                {content.ctaLabel}
              </a>
            </div>
          )}

          {/* Team cards */}
          {content.teamMembers?.length > 0 && (
            <>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #E5E7EB",
                  margin: "24px 0",
                }}
              />
              <p
                style={{
                  margin: "0 0 20px",
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Meet the Team
              </p>
              {content.teamMembers.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: 20,
                  }}
                >
                  {m.photoUrl ? (
                    <Image
                      width={56}
                      height={56}
                      src={m.photoUrl}
                      alt={m.name}
                      style={{
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: 16,
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: "#E5E7EB",
                        marginRight: 16,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        color: "#9CA3AF",
                      }}
                    >
                      {m.name?.[0] ?? "?"}
                    </div>
                  )}
                  <div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 15,
                        fontWeight: 600,
                        color: "#111827",
                      }}
                    >
                      {m.name}
                    </p>
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: 13,
                        color: "#6B7280",
                      }}
                    >
                      {m.title}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Contact block */}
          {(content.contactEmail ||
            content.contactPhone ||
            content.contactWebsite ||
            content.contactAddress) && (
            <>
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #E5E7EB",
                  margin: "24px 0",
                }}
              />
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Contact
              </p>
              {content.contactEmail && (
                <p
                  style={{ margin: "0 0 4px", fontSize: 14, color: "#374151" }}
                >
                  {content.contactEmail}
                </p>
              )}
              {content.contactPhone && (
                <p
                  style={{ margin: "0 0 4px", fontSize: 14, color: "#374151" }}
                >
                  {content.contactPhone}
                </p>
              )}
              {content.contactWebsite && (
                <p
                  style={{ margin: "0 0 4px", fontSize: 14, color: "#374151" }}
                >
                  {content.contactWebsite}
                </p>
              )}
              {content.contactAddress && (
                <p style={{ margin: 0, fontSize: 14, color: "#374151" }}>
                  {content.contactAddress}
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            background: "#F9FAFB",
            padding: "16px 40px",
            borderTop: "1px solid #E5E7EB",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#9CA3AF",
              textAlign: "center",
            }}
          >
            {content.companyName} · Unsubscribe
          </p>
        </div>
      </div>
    </div>
  );
}
