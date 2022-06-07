import { render, screen } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';

import { createSliceContext } from './createSliceContext';

const contextName = 'TestContext';
const initialState = { count: 0, id: 0 };

const createSlice = () => {
  return createSliceContext({
    name: contextName,
    initialState,
    reducers: {
      increment: state => {
        state.count++;
      },
      create: state => {
        state.id++;
      },
    },
  });
}

type RenderSpies = {
  countSelectorComponent: jest.Mock;
  idSelectorComponent: jest.Mock;
  actionsComponent: jest.Mock;
}

interface RenderTestComponentOptions {
  canProvide: boolean;
  renderSpies?: RenderSpies;
  createSlice: typeof createSlice;
}

const renderTestComponent = ({ canProvide, renderSpies, createSlice }: RenderTestComponentOptions) => {
  const { useSelector, useActions, Provider } = createSlice();
  const wrapper = canProvide ? Provider : undefined;

  function CountSelectorTestComponent() {
    const count = useSelector(state => state.count);
    renderSpies?.countSelectorComponent();

    return (
      <p aria-label="count">{count}</p>
    );
  }

  function IdSelectorTestComponent() {
    const id = useSelector(state => state.id);
    renderSpies?.idSelectorComponent();

    return (
      <p aria-label="id">{id}</p>
    );
  }

  function ActionsTestComponent() {
    const actions = useActions();
    renderSpies?.actionsComponent();

    return (
      <>
        <button onClick={actions.increment}>increment</button>
        <button onClick={actions.create}>create</button>
      </>
    );
  }

  function TestComponent() {
    return (
      <div>
        <CountSelectorTestComponent />
        <IdSelectorTestComponent />
        <ActionsTestComponent />
      </div>
    );
  }

  return render(<TestComponent />, { wrapper });
}

describe('createSliceContext()', () => {
  describe('when the context is not provided', () => {
    const options = {
      createSlice,
      canProvide: false,
    };

    it('should throw an error', () => {
      // prevent the error from being printed to the console
      const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => renderTestComponent(options)).toThrowError(new RegExp(contextName));

      spyConsoleError.mockRestore();
    });
  });

  describe('when the context is provided', () => {
    const options = {
      createSlice,
      canProvide: true,
    };

    it('should provide a context with reducer to the component tree', () => {
      renderTestComponent(options);

      const initialCountElement = screen.getByLabelText('count');
      expect(initialCountElement).toBeInTheDocument();
      expect(initialCountElement).toHaveTextContent('0');

      const initialIdElement = screen.getByLabelText('id');
      expect(initialIdElement).toBeInTheDocument();
      expect(initialIdElement).toHaveTextContent('0');
    });

    it('should increment the count when the increment action is dispatched', () => {
      renderTestComponent(options);

      const incrementButton = screen.getByText('increment');
      fireEvent.click(incrementButton);

      const initialCountElement = screen.getByLabelText('count');
      expect(initialCountElement).toBeInTheDocument();
      expect(initialCountElement).toHaveTextContent('1');

      const initialIdElement = screen.getByLabelText('id');
      expect(initialIdElement).toBeInTheDocument();
      expect(initialIdElement).toHaveTextContent('0');
    });

    describe('rendering tests', () => {
      const render = () => {
        const options = {
          createSlice,
          canProvide: true,
          renderSpies: {
            countSelectorComponent: jest.fn(),
            idSelectorComponent: jest.fn(),
            actionsComponent: jest.fn(),
          },
        };

        const renderResults = renderTestComponent(options);

        return {
          ...renderResults,
          renderSpies: options.renderSpies,
        };
      }

      it('should render every component only once when no actions are dispatched', () => {
        const { renderSpies } = render();

        expect(renderSpies.countSelectorComponent).toBeCalledTimes(1);
        expect(renderSpies.idSelectorComponent).toBeCalledTimes(1);
        expect(renderSpies.actionsComponent).toBeCalledTimes(1);
      });

      it('should only re-render the components that are selecting a value changed by the dispatched action', () => {
        const { renderSpies } = render();

        const incrementButton = screen.getByText('increment');
        fireEvent.click(incrementButton);

        expect(renderSpies.countSelectorComponent).toBeCalledTimes(2);
        expect(renderSpies.idSelectorComponent).toBeCalledTimes(1);
        expect(renderSpies.actionsComponent).toBeCalledTimes(1);
      });
    });
  });

  describe('when the context is provided with a lazy initial state', () => {
    const createSlice = () => {
      return createSliceContext({
        name: contextName,
        initialState: () => initialState,
        reducers: {
          increment: state => {
            state.count++;
          },
          create: state => {
            state.id++;
          },
        },
      });
    }

    const options = {
      createSlice,
      canProvide: true,
    };

    it('should provide a context with reducer to the component tree', () => {
      renderTestComponent(options);

      const initialCountElement = screen.getByLabelText('count');
      expect(initialCountElement).toBeInTheDocument();
      expect(initialCountElement).toHaveTextContent('0');

      const initialIdElement = screen.getByLabelText('id');
      expect(initialIdElement).toBeInTheDocument();
      expect(initialIdElement).toHaveTextContent('0');
    });

    it('should increment the count when the increment action is dispatched', () => {
      renderTestComponent(options);

      const incrementButton = screen.getByText('increment');
      fireEvent.click(incrementButton);

      const initialCountElement = screen.getByLabelText('count');
      expect(initialCountElement).toBeInTheDocument();
      expect(initialCountElement).toHaveTextContent('1');

      const initialIdElement = screen.getByLabelText('id');
      expect(initialIdElement).toBeInTheDocument();
      expect(initialIdElement).toHaveTextContent('0');
    });

    describe('rendering tests', () => {
      const render = () => {
        const options = {
          createSlice,
          canProvide: true,
          renderSpies: {
            countSelectorComponent: jest.fn(),
            idSelectorComponent: jest.fn(),
            actionsComponent: jest.fn(),
          },
        };

        const renderResults = renderTestComponent(options);

        return {
          ...renderResults,
          renderSpies: options.renderSpies,
        };
      }

      it('should render every component only once when no actions are dispatched', () => {
        const { renderSpies } = render();

        expect(renderSpies.countSelectorComponent).toBeCalledTimes(1);
        expect(renderSpies.idSelectorComponent).toBeCalledTimes(1);
        expect(renderSpies.actionsComponent).toBeCalledTimes(1);
      });

      it('should only re-render the components that are selecting a value changed by the dispatched action', () => {
        const { renderSpies } = render();

        const incrementButton = screen.getByText('increment');
        fireEvent.click(incrementButton);

        expect(renderSpies.countSelectorComponent).toBeCalledTimes(2);
        expect(renderSpies.idSelectorComponent).toBeCalledTimes(1);
        expect(renderSpies.actionsComponent).toBeCalledTimes(1);
      });
    });
  });
});
