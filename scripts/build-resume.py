"""
Generates the public résumé PDF at public/Vishnu-Vardhan-Tekkem-Resume.pdf.

The content below is transcribed from Vishnu's July 2026 résumé with ONE
deliberate change: the phone number is omitted, because the résumé is published
on a public static site where it would be scraped. The portfolio URL is included
in its place.

The PDF is rebuilt from this source rather than redacted from the original.
Redacting a PDF by drawing over text leaves the original string recoverable in
the content stream; regenerating guarantees the phone number is simply not in
the file.

Run:  python scripts/build-resume.py
"""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
)

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "Vishnu-Vardhan-Tekkem-Resume.pdf"

NAME = "VISHNU VARDHAN TEKKEM"
LOCATION = "Pune, Maharashtra, India"
EMAIL = "tvishnuvardhan.503@gmail.com"
PORTFOLIO = "tekkem007.github.io/portfolio"
ARTSTATION = "artstation.com/voyagervishnu"
LINKEDIN = "linkedin.com/in/vishnutekkem"

INK = colors.HexColor("#14181d")
MUTED = colors.HexColor("#4a5560")
RULE = colors.HexColor("#c3ccd4")
ACCENT = colors.HexColor("#b4701f")

styles = {
    "name": ParagraphStyle(
        "name",
        fontName="Helvetica-Bold",
        fontSize=17,
        leading=20,
        textColor=INK,
        spaceAfter=4,
    ),
    "role": ParagraphStyle(
        "role",
        fontName="Helvetica",
        fontSize=10,
        leading=13,
        textColor=ACCENT,
        spaceAfter=5,
    ),
    "contact": ParagraphStyle(
        "contact",
        fontName="Helvetica",
        fontSize=8.6,
        leading=12.5,
        textColor=MUTED,
    ),
    "section": ParagraphStyle(
        "section",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=12,
        textColor=INK,
        spaceBefore=2,
        spaceAfter=3,
    ),
    "body": ParagraphStyle(
        "body",
        fontName="Helvetica",
        fontSize=9,
        leading=12.6,
        textColor=INK,
        alignment=TA_LEFT,
    ),
    "jobtitle": ParagraphStyle(
        "jobtitle",
        fontName="Helvetica-Bold",
        fontSize=9.6,
        leading=12.5,
        textColor=INK,
        spaceBefore=5,
    ),
    "jobmeta": ParagraphStyle(
        "jobmeta",
        fontName="Helvetica-Oblique",
        fontSize=8.6,
        leading=11.5,
        textColor=MUTED,
        spaceAfter=2.5,
    ),
    "bullet": ParagraphStyle(
        "bullet",
        fontName="Helvetica",
        fontSize=9,
        leading=12.4,
        textColor=INK,
        leftIndent=9,
        bulletIndent=0,
        spaceAfter=1.2,
    ),
}


def rule(space_before=5, space_after=4):
    return [
        Spacer(1, space_before),
        HRFlowable(width="100%", thickness=0.6, color=RULE, spaceBefore=0, spaceAfter=0),
        Spacer(1, space_after),
    ]


def section(title):
    return [Paragraph(title.upper(), styles["section"])]


def bullets(items):
    return [Paragraph(text, styles["bullet"], bulletText="–") for text in items]


def job(title, org, meta, points):
    """A role is kept on one page where it fits, so it never splits mid-bullet."""
    block = [
        Paragraph(title, styles["jobtitle"]),
        Paragraph(f"{org} &nbsp;|&nbsp; {meta}", styles["jobmeta"]),
        *bullets(points),
    ]
    return KeepTogether(block)


def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=17 * mm,
        rightMargin=17 * mm,
        topMargin=15 * mm,
        bottomMargin=14 * mm,
        title=f"{NAME.title()} - Resume",
        author=NAME.title(),
        subject="Unreal Engine Artist and Technical Artist",
        creator="reportlab",
    )
    frame = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        doc.width,
        doc.height,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="resume", frames=[frame])])

    story = []

    # --- Header. No phone number: this file is published publicly. ---
    story.append(Paragraph(NAME, styles["name"]))
    # Positioning line under the name. This is how Vishnu presents himself; the
    # job titles in Professional Experience below remain exactly as held.
    story.append(Paragraph("Unreal Engine Artist &amp; Technical Artist", styles["role"]))
    story.append(
        Paragraph(
            f"{LOCATION} &nbsp;|&nbsp; "
            f'<a href="mailto:{EMAIL}" color="#14181d">{EMAIL}</a><br/>'
            f'Portfolio: <a href="https://{PORTFOLIO}" color="#14181d">{PORTFOLIO}</a> '
            f'&nbsp;|&nbsp; ArtStation: <a href="https://www.{ARTSTATION}" color="#14181d">{ARTSTATION}</a> '
            f'&nbsp;|&nbsp; LinkedIn: <a href="https://www.{LINKEDIN}" color="#14181d">{LINKEDIN}</a>',
            styles["contact"],
        )
    )
    story += rule(6, 6)

    # --- Summary ---
    story += section("Professional Summary")
    story.append(
        Paragraph(
            "Unreal Engine Artist and Technical Artist with experience in real-time environment "
            "production, stylized asset creation, Unreal Engine workflows, and AI-assisted rapid "
            "prototyping. Skilled in Blender, Substance 3D Painter, Unreal Engine 5, lighting, "
            "optimization, draw-call reduction, and visual storytelling.",
            styles["body"],
        )
    )
    story += rule()

    # --- Core highlights ---
    story += section("Core Highlights")
    story += bullets(
        [
            "Led 3D production workflows, asset reviews, and team coordination.",
            "Strong in low-poly environment art, PBR texturing, Unreal Engine lighting, and real-time optimization.",
            "Used AI tools for interactive website prototyping, UI/UX concepts, visuals, and story-driven ideas.",
            "Created AI-assisted workflow tools, reusable skills, and implementation support assets.",
        ]
    )
    story += rule()

    # --- AI prototyping ---
    story += section("AI Prototyping Experience")
    story += bullets(
        [
            "Built fast working prototypes for interactive websites and digital experiences using AI tools.",
            "Developed UI/UX concepts, visual directions, generated imagery, and story structures.",
            "Created reusable AI-assisted workflow tools to accelerate implementation and delivery.",
            "Focused on execution planning while AI-supported workflows assisted backend tasks.",
        ]
    )
    story += rule()

    # --- Experience ---
    story += section("Professional Experience")
    story.append(
        job(
            "3D Team Lead",
            "Analyzer Tensor Technologies",
            "Pune, Maharashtra, India &nbsp;|&nbsp; Apr 2026 - Present",
            [
                "Promoted and transferred from Analyzer CAE Solutions Pvt. Ltd. after the department spun out into a new company.",
                "Lead 3D environment production, team coordination, and real-time workflow execution.",
                "Oversee scene lighting, optimization, draw-call reduction, and basic Blueprint support in Unreal Engine.",
                "Manage asset quality, workflow alignment, and output consistency.",
            ],
        )
    )
    story.append(
        job(
            "3D Environment Artist",
            "Analyzer CAE Solutions Pvt. Ltd.",
            "Pune, Maharashtra, India &nbsp;|&nbsp; Jun 2024 - Mar 2026",
            [
                "Created stylized low-poly environment assets in Blender with PBR texturing in Substance 3D Painter.",
                "Lit scenes in Unreal Engine 5 using Lumen and baked workflows.",
                "Optimized environments using virtual textures, trim sheets, shaders, and draw-call reduction techniques.",
                "Built basic Blueprints for simple interactions and workflow needs.",
            ],
        )
    )
    story.append(
        job(
            "3D Artist",
            "Aswaforce Pvt. Ltd.",
            "Mehsana, Gujarat, India &nbsp;|&nbsp; Jul 2022 - Oct 2023",
            [
                "Created 3D models and textures for gaming, VR, and architectural visualization.",
                "Worked with 3ds Max, Maya, Blender, Substance tools, V-Ray, Arnold, and ZBrush.",
                "Collaborated with teams to integrate assets into final deliverables.",
            ],
        )
    )
    story.append(
        job(
            "Freelance 3D Artist",
            "Independent",
            "Remote &nbsp;|&nbsp; May 2021 - Mar 2022",
            [
                "Created mid-poly 3D models and textures for product advertising.",
                "Applied PBR workflow principles and baking methods for high-detail results.",
            ],
        )
    )
    story.append(
        job(
            "EDGE Trainer",
            "Tata ClassEdge / The Radiant Way School",
            "Raipur, Chhattisgarh, India &nbsp;|&nbsp; Feb 2020 - Mar 2021",
            [
                "Maintained Linux-based Tata ClassEdge systems.",
                "Assisted teachers with platform usage and technical guidance.",
                "Conducted regular teacher training sessions.",
            ],
        )
    )
    story += rule(6, 4)

    # --- Skills ---
    story += section("Skills")
    skills = [
        ("3D Modeling", "Blender, Maya, 3ds Max, ZBrush"),
        ("Texturing", "Substance 3D Painter, Photoshop"),
        ("Rendering", "Cycles, Marmoset Toolbag, V-Ray, Arnold"),
        ("Game Engine", "Unreal Engine 5"),
        ("Unreal Workflow", "Lighting, Lumen, baked lighting, optimization, draw-call reduction, basic Blueprints"),
        (
            "AI &amp; Prototyping",
            "UI/UX concepts, interactive website prototyping, image generation, story building, implementation planning",
        ),
        ("Core Areas", "Environment art, low-poly assets, PBR workflow, asset optimization, team coordination"),
    ]
    for label, value in skills:
        story.append(Paragraph(f"<b>{label}:</b> {value}", styles["body"]))
        story.append(Spacer(1, 1.5))
    story += rule(5, 4)

    # --- Education ---
    story += section("Education")
    story.append(
        Paragraph(
            "<b>Diploma in Game Art and Design Integration</b> &mdash; MAAC, Girish Park, Kolkata &nbsp;|&nbsp; 2018",
            styles["body"],
        )
    )
    story.append(Spacer(1, 2))
    story.append(
        Paragraph(
            "<b>Bachelor of Computer Applications</b> &mdash; Midnapore College, Vidyasagar University &nbsp;|&nbsp; 2015",
            styles["body"],
        )
    )

    doc.build(story)
    print(f"Wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.0f} kB)")


if __name__ == "__main__":
    build()
