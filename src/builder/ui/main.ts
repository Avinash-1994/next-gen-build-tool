import { mount } from 'svelte';
import App from './App.svelte';

console.log('Mounting Svelte app');
const app = mount(App, {
    target: document.getElementById('app')!,
});
console.log('Svelte app mounted');

export default app;
