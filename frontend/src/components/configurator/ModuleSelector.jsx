import "./ModuleSelector.css";

const getProductImageUrl = (product) => {
  return product?.images?.[0]?.url || "";
};

const formatHolesRequired = (holesRequired) => {
  const total = Number(holesRequired) || 0;

  return `${total} trou${total > 1 ? "s" : ""}`;
};

function ModuleSelector({ modules, selectedBoard, selectedModules, onToggle }) {
  if (!selectedBoard) return null;

  const usedHoles = selectedModules.reduce(
    (accumulator, module) => accumulator + (module.variant.holesRequired || 0),
    0
  );
  const remainingHoles =
    (selectedBoard.variant.holesCount || 0) - usedHoles;

  return (
    <div className="module-selector">
      <p className="module-selector__label">Modules :</p>

      <div className="module-selector__grid">
        {modules.map((module) => {
          const variant =
            module.variants.find((item) => item.size === selectedBoard.variant.size) ||
            module.variants[0];
          const imageUrl = getProductImageUrl(module);

          if (!variant) return null;

          const isSelected = selectedModules.some(
            (item) => item.variant.id === variant.id
          );
          const canAdd =
            isSelected || (variant.holesRequired || 0) <= remainingHoles;

          return (
            <button
              type="button"
              key={variant.id}
              className={`module-card ${isSelected ? "module-card--selected" : ""} ${!canAdd ? "module-card--disabled" : ""}`}
              onClick={() => canAdd && onToggle(variant, module)}
              title={`${module.name} • ${variant.holesRequired} trous • ${variant.price} EUR`}
            >
              <span className="module-card__media">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={module.name}
                    className="module-card__image"
                  />
                ) : (
                  <span className="module-card__placeholder" aria-hidden="true">
                    {module.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>

              <span className="module-card__content">
                <span className="module-card__name">{module.name}</span>
                <span className="module-card__meta">
                  {formatHolesRequired(variant.holesRequired)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleSelector;
