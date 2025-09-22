---
name: "✉️ Context or Intent proposal"
about: Propose new contexts and intents to help implement a particular use-case!
title: ''
labels: enhancement, Context Data & Intents
assignees: ''
---

## Enhancement Request

### Use Case

<!--- 
Please specify at least one use case that the proposed additions would support

For example:
> User may want to view current positions for a list of securities
--->

### Intents

#### \<intent name goes here\>

<!---
Brief description of purpose
Include indication of input and output context types (if any)
--->

### Contexts

#### \<context name goes here\>

<!--- Brief description of purpose
--->

##### Details

| Property    | Type    | Required | Example Value       |
|-------------|---------|----------|---------------------|
| `type`      | string  | Yes      | `'fdc3.instrument'` |
| `name`      | string  | No       | `'Microsoft'`       |
| `id.ticker` | string  | No       | `'MSFT'`            |
| `id.BBG`    | string  | No       | `'MSFT:US'`         |

##### Example

<!---
```js
const instrument = {
    type: 'fdc3.instrument',
    name: 'International Business Machines',
    id: {
        ticker: 'ibm'
    }
}
```
--->

### Additional Information
<!---
Please add any other information that can provide additional detail for this enhancement request
--->