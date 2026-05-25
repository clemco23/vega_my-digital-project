import * as MarqueeModule from "react-fast-marquee";

import "./ModulesMarqueeSection.css";

const Marquee =
  MarqueeModule.default?.default ??
  MarqueeModule.default ??
  MarqueeModule;

const moduleItems = [
  { icon: "\u{1F512}", label: "Loquet de porte" },
  { icon: "\u2699\uFE0F", label: "Engrenage bois" },
  { icon: "\u{1F511}", label: "Cadenas & clé" },
  { icon: "\u{1F300}", label: "Minuteur rotatif" },
  { icon: "\u{1F39B}\uFE0F", label: "Interrupteur métal" },
  { icon: "\u26D3", label: "Chaîne à maillons" },
  { icon: "\u23F3", label: "Sablier" },
  { icon: "\u{1F9F2}", label: "Aimant" },
];

function ModulesMarqueeSection() {
  return (
    <div className="modules-marquee-section">
      <div className="modules-marquee-section__inner">
        <h2 className="modules-marquee-section__title">
          Un module pour chaque besoin
        </h2>

        <Marquee
          className="modules-marquee-section__track"
          gradient={false}
          speed={34}
          pauseOnHover
          autoFill
        >
          {moduleItems.map(({ icon, label }) => (
            <div className="modules-marquee-section__chip" key={label}>
              <span
                className="modules-marquee-section__chip-icon"
                aria-hidden="true"
              >
                {icon}
              </span>
              <span className="modules-marquee-section__chip-label">{label}</span>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export default ModulesMarqueeSection;
