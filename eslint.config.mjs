import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const r3fProps = [
  // @react-three/fiber — object instantiation
  "object", "dispose", "attach", "args",
  // @react-three/fiber — shader material
  "vertexShader", "fragmentShader", "uniforms", "depthWrite", "blending",
  // @react-three/fiber — mesh / scene graph
  "material", "position", "renderOrder",
  // @react-three/fiber — material flags
  "transparent",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "react/no-unknown-property": ["error", { ignore: r3fProps }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
