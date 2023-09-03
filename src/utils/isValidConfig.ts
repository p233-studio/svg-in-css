export default function isValidConfig(config: any): config is AppState {
  return (
    typeof config.prefix === "string" &&
    typeof config.size === "string" &&
    typeof config.enableSVGO === "boolean" &&
    typeof config.enableWebkitPrefix === "boolean" &&
    typeof config.enableBeforePseudo === "boolean" &&
    Array.isArray(config.svgList) &&
    typeof config.previewColor === "string" &&
    typeof config.configVersion === "number"
  );
}
