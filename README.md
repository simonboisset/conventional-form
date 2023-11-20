# Typescript validation for react form

See [validest documentation](https://validest.dev)
Validation schema for typescript.

## Concept

This package take some conventions which are listed below :

### Uncontroled inputs

You don't need to control your input value to validate your form values on submit. However you can also use controled input but this will not have any impact of validation step.

### Use name propertie of inputs

To have access to form values without input control you must use the name propertie of each input.
If you have any value wich is not a real input value you must add an hidden input with the name you want.

### Name convention

Your form value will be an object with keys as each input names in your form.
You can define nested object and array with '-' in your name like this :

```ts
// List of your inputs names
'name-lastname';
'name-firstname';
'age';
'contacts-0-userId';
'contacts-0-text';
'contacts-1-userId';
'contacts-1-text';

// Your data will be like this

type Data = {
  name: { lastname: string; firstname: string };
  age: string;
  contacts: [{ userId: string; text: string }, { userId: string; text: string }];
};
```

## Quick start

### Installation

```sh
yarn add @validest/core @validest/react validest
```

### useValidestForm

```tsx
import { useValidestForm } from '@validest/react';

const schema = object({
  name:object({ lastname: string('Please enter your lastname'), firstname: string('Please enter your firstname') }),
  age: number('Please enter a number for your age'),
  contacts: array(object({ userId: string('Your contact must be defined'), text: maybe(string()) }));
})

const Component =()=>{
  const { error, onSubmit } = useValidestForm(schema,(data,e) =>{
  // do what you want after validation
})
return (
  <form onSubmit={onSubmit}>
    <input name='name-lastname'/>
    {error?.name?.lastname && <div>{error.name.lastname}<div>}
    <input name='name-firstname'/>
    <input name='age'/>
    {error?.age && <div>{error.age}<div>}
    <input name='contacts-0-userId'/>
    <input name='contacts-0-text'/>
    <input name='contacts-1-userId'/>
    <input name='contacts-1-text'/>
    {error?.contacts?.[1]?.text && <div>{error.contacts.[1].text}<div>}
    <button type='submit'>Submit</button>
  </form>
)}
```

The returned value of validate function will be typed.

### Valide on change

You can also valide your form on change

```ts
const Component =()=>{
  const { error, onChange } = useValidestForm(schema,(data,e) =>{
  // make that you want after validation
})
return (
  <form onChange={onChange}>
    <input name='name-lastname'/>
    {error?.name?.lastname && <div>{error.name.lastname}<div>}
    <input name='name-firstname'/>
    <input name='age'/>
    {error?.age && <div>{error.age}<div>}
    <input name='contacts-0-userId'/>
    <input name='contacts-0-text'/>
    <input name='contacts-1-userId'/>
    <input name='contacts-1-text'/>
    {error?.contacts?.[1]?.text && <div>{error.contacts.[1].text}<div>}
    <button type='submit'>Submit</button>
  </form>
)}
```
