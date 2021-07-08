# bs-autocomplete

bs-autocomplete is a Bootstrap-styled select box that support searching and compatible with Vue.

## Usage

Props         | Type               | Default Value    | Description
------------- | ------------------ | ---------------- | -----------
value         | [String, Object]   | ''               | Used by `v-model`.
select_class  | String             | 'custom-select'  | Class used by select box.
input_class   | String             | 'form-control'   | Class used by input box.
placeholder   | String             | ''               | Placeholder of the search input.
items         | Array              | []               | List for the listed items.
item_text     | [String, Function] | 'text'           | Attribute name or Callback rendered on the select box option filed.
return_attr   | String             |                  | Value of the selected `return_attr` will be returned when the option is selected.
return_obj    | Boolean            | false            | If set to true, the return value will be object.
max_height    | [String, Number]   | '300px'          | The max height of the dropdown list.
required      | Boolean            | false            | If set to true, the select box will be required.

## Example

```vue

<bs-autocomplete
    v-model="value"
    :select_class="select_class"
    :placeholder="placeholder"
    :items="items"
    :return_attr="attr"
    :item_text="item_text"
    required
></bs-autocomplete>
```

```javascript
new Vue({
    data: {
        value: null,
        select_class: 'custom-select-class',
        input_class: 'custom-input-class',
        placeholder: 'Search...',
        items: [{
            text: 'text',
            value: 'value',
            disable: true,
        }],
        item_text: 'text',
        return_attr: 'value',
        return_obj: true,
        max_height: 500,
        required: true,
    }
});
```

## Known issues

1. When clicked on the select box, there is an option pop-up on mobile devices Safari(iOS) and Firefox(Android)
2. Does not work in Internet Explorer

## Contributors

1. <a href="https://github.com/devitcf">devitcf</a>
1. <a href="https://github.com/samuelleung123">samuelleung123</a>
