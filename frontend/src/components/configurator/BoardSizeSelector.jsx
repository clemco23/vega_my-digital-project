import "./BoardSizeSelector.css";

const sizeLabels = {
  S: "Small",
  M: "Medium",
  L: "Large",
};

const previewLayouts = {
  S: 6,
  M: 8,
  L: 10,
};

function BoardSizeSelector({ boards, selectedVariant, onSelect }) {
  const board = boards[0];

  if (!board) return null;

  const variants = [...board.variants].sort((first, second) => {
    const order = { S: 0, M: 1, L: 2 };
    return (order[first.size] ?? 99) - (order[second.size] ?? 99);
  });

  return (
    <div className="board-size">
      <p className="board-size__label">Taille de la planche :</p>

      <div className="board-size__options">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id;
          const sizeKey = variant.size?.toUpperCase() || "M";
          const previewSize =
            sizeKey === "S" || sizeKey === "L" ? sizeKey.toLowerCase() : "m";
          const previewHoleCount = previewLayouts[sizeKey] || previewLayouts.M;

          return (
            <button
              type="button"
              key={variant.id}
              className={`board-size__btn ${isSelected ? "board-size__btn--active" : ""}`}
              onClick={() => onSelect(variant)}
              title={`${variant.holesCount} trous`}
            >
              <span
                className={`board-size__preview board-size__preview--${previewSize}`}
                aria-hidden="true"
              >
                <span className="board-size__preview-surface">
                  {Array.from({ length: previewHoleCount }, (_, index) => (
                    <span
                      key={`board-size-preview-hole-${variant.id}-${index}`}
                      className="board-size__preview-hole"
                    />
                  ))}
                </span>
              </span>

              <span className="board-size__meta">
                <span className="board-size__text">
                  {sizeLabels[variant.size] || variant.size}
                </span>
                <span className="board-size__details">
                  {variant.holesCount} trous
                </span>
              </span>

              <span
                className={`board-size__indicator ${isSelected ? "board-size__indicator--active" : ""}`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BoardSizeSelector;
