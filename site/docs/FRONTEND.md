# Frontend

## Tailwind CSS & Flowbite

This project uses [Tailwind CSS](https://tailwindcss.com/) framework with its class syntax.
More specifically, we base our components on [Flowbite React](https://flowbite-react.com/) and [Flowbite](https://flowbite.com/) which is built on top of TailwindCSS.

### Steps for developing

In order to keep styling consistency on the site, we follow a set of steps when developing. This is also to make the development process more agile and simple.

1. Develop your component using [Flowbite React components](https://flowbite-react.com/)
2. If your components is not fully contemplated by Flowbite react, check [Flowbite components](https://flowbite.com/#components) and use the provided HTMLs.
3. If you need to improve styling, use only Tailwind CSS classes.

**Examples**
If you want to place a new [Flowbite React button](https://flowbite-react.com/buttons):

```javascript
import { Button } from "flowbite-react";

const YourComponent = () => {
  return <Button color="success">New button</Button>;
};
```

If you want to customize a [Flowbite button](https://flowbite.com/docs/components/buttons/):

```javascript
const YourComponent = () => {
  return (
    <button
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Default
    </button>
  );
};
```
