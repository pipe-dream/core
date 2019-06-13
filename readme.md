# pipe-dream/core
This package supplies most of the frontend necessary for a Pipe Dream Language implementation

## Development guide
Assuming you are working on a language implementation and the core at the same time, you may follow this guide.

### 1. Install the core
```bash
git clone git@github.com:pipe-dream/core.git
```

### 2. Setup a Laravel (beta) implementation inside a fresh host application:
```bash
laravel new pd-host
cd pd-host
mkdir -p packages/PipeDream
cd packages/PipeDream
git clone git@github.com:pipe-dream/laravel-beta.git Laravel
```
Add namespace to `pd-host/composer.json`:
```json
"autoload": {
    "psr-4": {
        "App\\": "app/",
        "PipeDream\\Laravel\\": "packages/PipeDream/Laravel/src"
    },
```
And in the providers array of `pd-host/config/app.php`:
```php
/*
* Package Service Providers...
*/
PipeDream\Laravel\PipeDreamServiceProvider::class,
```

### Bindings
Next, we want to use the `core` inside our Laravel implementation repo. To do that we use yarn to setup a symlink:
```bash
cd /path/to/core
yarn link
cd /path/to/pd-host/packages/PipeDream/Laravel
yarn link core
```

Now our Laravel implementation can import the core as simple as this:
```js
import Core from 'core'
```

Finally, you probably want to open up the two projects in two separate editors as well as terminal tabs, and have `yarn watch` running in each project.

Changes to core and the Laravel package repo should now instantly reflect when visiting `pd-host.test/pipe-dream`