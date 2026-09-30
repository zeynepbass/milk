import { Component } from "react";
import { ErrorState } from "@/shared/components/molecules";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(previousProps) {
    if (this.state.error && previousProps.resetKey !== this.props.resetKey) {
      this.reset();
    }
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title="Bir şeyler ters gitti"
          description="Sayfa yüklenirken beklenmeyen bir hata oluştu."
          onRetry={this.reset}
        />
      );
    }

    return this.props.children;
  }
}
