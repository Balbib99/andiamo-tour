import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Qué se ve si algo falla. Sin esto, un aviso con un botón para volver al inicio. */
  fallback?: ReactNode;
}

/**
 * Si un componente se rompe, React deja la pantalla en blanco. Esto lo contiene: el resto de la web sigue funcionando.
 */
export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    if (this.props.fallback !== undefined) return this.props.fallback;
    return (
      <div className="error-box" role="alert">
        <h2>Algo ha fallado</h2>
        <p>Vuelve al inicio y sigue desde ahí: lo que habéis marcado como visto no se pierde.</p>
        <a className="btn btn-primary" href="/">
          Volver al inicio
        </a>
      </div>
    );
  }
}
