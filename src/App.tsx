import { defineComponent } from 'vue';
import Game from './components/Game';

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div id="app">
        <Game />
      </div>
    );
  },
});