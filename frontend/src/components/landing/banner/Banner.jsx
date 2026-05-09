import "./Banner.css";
import "../../../index.css";

const bannerItems = [
  "MODULARIT\u00C9 \u00C9VOLUTIVE",
  "BOIS FSC CERTIFI\u00C9",
  "P\u00C9DAGOGIE D\u2019INSPIRATION MONTESSORI",
  "ASSEMBL\u00C9 EN FRANCE",
];

const repeatedBannerItems = [...bannerItems, ...bannerItems];

function Banner() {
  return (
    <div className="marquee" aria-label="Points forts du produit">
      <div className="marquee-content">
        {repeatedBannerItems.map((item, index) => (
          <div className="marquee-item" key={`${item}-${index}`}>
            <span className="marquee-item__label">{item}</span>
            <span className="marquee-item__divider" aria-hidden="true">
              {"\u25C6"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Banner;
