import "./ModuleSelector.css";

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
              <span className="module-card__name">{module.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ModuleSelector;
