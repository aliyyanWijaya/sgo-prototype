'use strict';

// React Native 0.81 + React 19.1's mockComponent crashes when a component is an
// arrow function (no .prototype). We wrap the original and fall back gracefully,
// using createElement(displayName, ...) so RNTL's getByText/getByTestId still work.

const mockComponentModule = require('react-native/jest/mockComponent');
const React = require('react');
const { createElement } = React;
const originalMockComponent = mockComponentModule.default;

mockComponentModule.default = function patchedMockComponent(
  moduleName,
  instanceMethods,
  isESModule,
) {
  try {
    return originalMockComponent(moduleName, instanceMethods, isESModule);
  } catch (_) {
    // Extract display name from module path (e.g. '../Libraries/Text/Text' → 'Text')
    const rawName =
      moduleName.split('/').pop().replace(/\.(tsx?|jsx?)$/, '') || 'Unknown';
    const displayName = rawName.replace(/^(RCT|RK)/, '');

    const Fallback = class extends React.Component {
      render() {
        const props = {};
        if (this.props) {
          for (const key of Object.keys(this.props)) {
            if (this.props[key] !== undefined) props[key] = this.props[key];
          }
        }
        return createElement(displayName, props, this.props.children);
      }
    };
    Object.defineProperty(Fallback, 'name', { value: displayName });
    Fallback.displayName = displayName;
    if (instanceMethods) Object.assign(Fallback.prototype, instanceMethods);
    return Fallback;
  }
};
