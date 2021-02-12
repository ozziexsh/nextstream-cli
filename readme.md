# Laravel Nextstream

A port of [Laravel Jetstream](https://jetstream.laravel.com/2.x/introduction.html) to [Next.js](https://nextjs.org/). All credit goes to [Taylor Otwell](https://twitter.com/taylorotwell) and the [Laravel team](https://laravel.com).

## Installation

```bash
$ npx create-nextstream-app new my-app
```

Laravel setup

First, add the required service providers in `config/app.php`

```php
'providers' => [
  // ...
  App\Providers\NextstreamServiceProvider::class,
],
```

Then, add the sanctum middleware to `app/Http/Kernel.php`

```php
'api' => [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'throttle:api',
    \Illuminate\Routing\Middleware\SubstituteBindings::class,
],
```

Then configure the database and serve the app

```bash
# ensure you set your db credentials in backend/.env
$ cd backend
$ php artisan migrate
$ php artisan serve
```

Next.js setup

```bash
$ cd frontend
$ npm run dev
```

By default your frontend will be available at http://localhost:3000 and your backend at http://localhost:8000

If you are not using the default localhost ports to serve either of your applications, ensure you update the `SESSION_DOMAIN` AND `SANCTUM_STATEFUL_DOMAINS` in your `backend/.env` file and the respective ones in `frontend/.env.local`.

## Usage

- [Components](#components)
  - [JetAppLayout](#jetapplayout)
  - [JetButton](#jetbutton)
  - [JetCheckbox](#jetcheckbox)
  - [JetConfirmationModal](#jetconfirmationmodal)
  - [JetDialogModal](#jetdialogmodal)
  - [JetDropdown](#jetdropdown)
  - [JetFormActionSection](#jetformactionsection)
  - [JetFormSection](#jetformsection)
  - [JetGuestLayout](#jetguestlayout)
  - [JetInputError](#jetinputerror)
  - [JetInput](#jetinput)
  - [JetLabel](#jetlabel)
  - [JetModal](#jetmodal)
  - [JetSectionBorder](#jetsectionborder)
  - [JetSectionTitle](#jetsectiontitle)
- [Available Hooks](#available-hooks)
  - [`useUser()`](#useuser)
  - [`useRefreshUser()`](#userefreshuser)
  - [`useFeatures()`](#usefeatures)
  - [`useModal()`](#usemodal)
  - [`useConfirmPassword()`](#useconfirmpassword)
- [Making HTTP Requests](#making-http-requests)
- [Writing API Endpoints](#writing-api-endpoints)
- [Protecting Frontend Routes](#protecting-frontend-routes)
- [Forms](#forms)

### Components

#### JetAppLayout

Acts as the base layout of your page. Includes top navigation + footer.

Accepts:

- `pageTitle: string` - sets the head `<title>` tag
- `header?: string` - optional, the white header right under the navigation

```tsx
import JetAppLayout from './jet/app-layout';

function Component() {
  return (
    <JetAppLayout pageTitle="Dashboard">
      {/* Your page content here... */}
    </JetAppLayout>
  );
}
```

#### JetButton

Button with a few different appearances for use within your application. Accepts all normal button props with the addition of `status`.

```tsx
import JetButton from './jet/button';

function Component() {
  return (
    <div>
      <JetButton>Primary</JetButton>
      <JetButton status={'secondary'}>Secondary</JetButton>
      <JetButton status={'danger'}>Danger</JetButton>
    </div>
  );
}
```

#### JetCheckbox

Styled checkbox. Takes same props as an HTML input.

```tsx
import JetCheckbox from './jet/button';

function Component() {
  return (
    <div>
      <label htmlFor="remember" className="flex items-center">
        <JetCheckbox id="remember" name="remember" checked={checked} />
        <span className="ml-2 text-sm text-gray-600">Remember me</span>
      </label>
    </div>
  );
}
```

#### JetConfirmationModal

```tsx
function Component() {
  const modal = useModal();

  return (
    <JetConfirmationModal
      {...modal.props}
      title={'Delete User?'}
      renderFooter={() => (
        <>
          <JetButton status={'secondary'} onClick={modal.close}>
            Nevermind
          </JetButton>
          <JetButton status={'danger'} className="ml-2">
            Delete
          </JetButton>
        </>
      )}
    >
      Are you sure you would like to delete this user?
    </JetConfirmationModal>
  );
}
```

#### JetDialogModal

```tsx
function Component() {
  const modal = useModal();

  return (
    <JetDialogModal
      {...modal.props}
      title={'Your one-time key'}
      renderFooter={() => (
        <>
          <JetButton className="ml-2">Ok</JetButton>
        </>
      )}
    >
      abcdefg1234
    </JetDialogModal>
  );
}
```

#### JetDropdown

Dropdown powered by [headless-ui](https://github.com/tailwindlabs/headlessui/tree/develop/packages/%40headlessui-react).

```tsx
function Component() {
  return (
    <JetDropdown renderTrigger={({ Trigger }) => <Trigger>Open</Trigger>}>
      {({ DropdownItem }) => (
        <div>
          <DropdownItem>
            <JetDropdownLink href={'/teams/1/settings'}>
              Team Settings
            </JetDropdownLink>
          </DropdownItem>
          <DropdownItem>
            <JetDropdownLink href={'/teams/new'}>
              Create New Team
            </JetDropdownLink>
          </DropdownItem>
        </div>
      )}
    </JetDropdown>
  );
}
```

#### JetFormActionSection

todo

#### JetFormSection

todo

#### JetGuestLayout

todo

#### JetInputError

todo

#### JetInput

todo

#### JetLabel

todo

#### JetModal

todo

#### JetSectionBorder

todo

#### JetSectionTitle

todo

### Available Hooks

#### useUser

Returns the logged in user via the cookie.

```tsx
import { useUser } from './jet/providers';

function Component() {
  const user = useUser();
}
```

#### useRefreshUser

Returns a function that you can call that will re-fetch the current user from the API and store it in the cookie.

```tsx
import { useRefreshUser } from './jet/providers';

function Component() {
  const refreshUser = useRefreshUser();

  // e.g. you updated the users name now need to refresh them accross the app
  function onUserUpdated() {
    await http('user', {
      method: 'patch',
      body: {
        // ...
      },
    });
    refreshUser();
  }
}
```

#### useFeatures

Returns all of the jetstream features and whether or not they are enabled for your application based on your configuration set in your Laravel app.

```tsx
import { useFeatures } from './jet/providers';

function Component() {
  // all booleans
  const {
    hasProfilePhotoFeatures,
    hasApiFeatures,
    hasAccountDeletionFeatures,
    canUpdateProfileInformation,
    updatePasswords,
    canManageTwoFactorAuthentication,
  } = useFeatures();
}
```

#### useModal

A convenience helper for storing modal state

```tsx
import { useModal } from './jet/providers';

function Component() {
  const myModal = useModal();

  // to open
  // myModal.open()

  // to close
  // myModal.close()

  return (
    <div>
      <JetButton onClick={myModal.open}>Confirm</JetButton>

      <JetConfirmModal title={'Are you sure?'} {...myModal.props}>
        {/* ... */}
      </JetConfirmModal>
    </div>
  );
}
```

#### useConfirmPassword

Allows you to ask the user to confirm their password via a modal before performaning an action. Will only prompt the user if they haven't confirmed their password since the [timeout set in your Laravel app](https://laravel.com/docs/8.x/authentication#password-confirmation-configuration).

Returns an object with the following keys:

- `loading` - Set to true while the request to the API to confirm the password goes through
- `ConfirmPasswordModal` - The component to render, takes no props
- `withPasswordConfirmation` - Pass the function you want to run after the password has been confirmed. Returns a function that when called triggers the confirm password flow

```tsx
import { useConfirmPassword } from './jet/providers';

function Component() {
  const {
    withPasswordConfirmation,
    ConfirmPasswordModal,
    loading,
  } = useConfirmPassword();

  return (
    <div>
      <JetButton
        onClick={withPasswordConfirmation(onSave)}
        disabled={isLoading}
      >
        Save
      </JetButton>

      <ConfirmPasswordModal />
    </div>
  );
}
```

### Making HTTP Requests

Included is an `http` helper that wraps the global `fetch` function and allows you to make requests to your api (and external ones) on both the client side and server side. This abstraction makes it easy to call api routes with relative url's and automatically includes the required cookies in the proper context.

The signature for the function matches that of the global `fetch`

```typescript
async function http(
  input: RequestInfo,
  init?: Init,
): {
  ok: boolean;
  response: Response; // raw fetch response
  data: any | null; // If ok and response type was JSON, this is the parsed body
  errors: any | null; // If not ok and response type was JSON, this is the parsed body
};
```

To make a request inside a React component (client side):

```typescript
// example GET request
async function getUser() {
  const { ok, data } = await http('user');
}

// example POST request
async function submit() {
  const { ok, data } = await http('user/password', {
    method: 'post',
    body: JSON.stringify({ old_password: 'abcd', password: 'defg' }),
  });
}
```

Making requests during SSR is almost exactly the same except you need to remember to include the `req` object from the context so we can forward along the cookie:

```typescript
export const getServerSideProps: GetServerSideProps = ({ req, res }) => {
  const { ok, response, data, errors } = await http('user', { req });
  if (!ok) {
    res.statusCode = 500;
    res.end();
  }
  return {
    props: {
      user: data.user,
    },
  };
};
```

The `http` helper requires you to format your data before sending it (e.g. in a `POST` request) so that it doesn't make the wrong assumption.

That means that if you are wanting to send JSON, you need to manually stringify it yourself as you would in a `fetch` call.

```typescript
async function onSubmit() {
  const { ok, response, data, errors } = await http('api/my-post-request', {
    method: 'post',
    body: JSON.stringify(data),
  });
}
```

Which also means you can pass formdata if you want (for file uploads, etc) and it will get handled appropriately without needing to specify any additional headers.

```typescript
async function onSubmit() {
  const formData = new FormData();
  formData.append('photo', myFile, myFile.name);
  const { ok, response, data, errors } = await http('api/my-post-request', {
    method: 'post',
    body: formData,
  });
}
```

### Writing API Endpoints

Endpoints can be built as normal the Laravel way. Make sure to place them in `routes/api.php` to ensure they are handled properly with CORS, and if you need them to be protected by authentication ensure they are wrapped in the `auth:sanctum` middleware.

### Protecting Frontend Routes

Included are two helper functions that make it easy to make routes "guest" only or "logged in" only.

To use these, simply export them as your getServerSideProps function.

```typescript
// use this if you want the page visible to only guests
export const getServerSideProps = redirectIfAuthenticated();

// use this if you need to be logged in to view the page
export const getServerSideProps = redirectIfGuest();
```

You can also provide a function that gets executed if you would still like to add your own logic that gets ran **after** the authentication check.

```typescript
export const getServerSideProps = redirectIfGuest(({ req }) => {
  const { ok, data } = await http('user', { req });
  // ...
  return {
    props: {
      user: data.user,
    },
  };
});
```

### Forms

All included forms make use of the `react-hook-form` library. To find out more, visit their website at [https://react-hook-form.com/](https://react-hook-form.com/).

## Roadmap

- [x] User authentication
- [x] Two factor authentication
- [x] Password recovery
- [x] Api keys
- [x] Profile photos
- [x] User deletion
- [ ] Team support
- [ ] Browser sessions
- [ ] Email verification
- [ ] Project initializer
- [ ] Tests
- [ ] Terms and conditions / privacy policy
- [ ] Documentation (http, components, auth, etc)
- [ ] Organize jet files + providers
