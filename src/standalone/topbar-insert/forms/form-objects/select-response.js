import { fromJS } from "immutable"
import { selectOperationObject, selectOperationForm } from "./select-operation"


const selectResponse = (updateForm, path, existing) => fromJS({
  response: {
    value: "",
    isRequired: true,
    name: "响应",
    description: "必填。要将示例添加到的响应.",
    updateForm: event => updateForm(event, path.concat(["response"])),
    validationMessage: "请选择要添加示例的响应。该字段为必填项.",
    options: ["选择或者添加响应"],
    dependsOn: ["operation", "value"],
    updateOptions: existing ? existing.getResponses: () => [],
    isValid: () => true
  },
  mediatype: {
    value: "",
    isRequired: true,
    name: "多媒体类型",
    description: "必填。响应的媒体类型。例如， text/plain 或者 application/json.",
    options: ["选择或者添加多媒体类型"],
    dependsOn: ["response", "value"],
    updateForm: event => updateForm(event, path.concat(["mediatype"])),
    updateOptions: existing ? existing.getMediaTypes : () => [],
    isValid: () => true,
    validationMessage: "请选择或添加媒体类型作为示例。该字段为必填项."
  }
})

export const selectResponseForm = (updateForm, path, existing) =>
  selectOperationForm(updateForm, path, existing)
    .merge(selectResponse(updateForm, path, existing))


export const selectResponseObject= (formData) => {
  const path = selectOperationObject(formData)
  path.push("responses")
  path.push(formData.getIn(["response", "value"]))
  path.push("content")
  path.push(formData.getIn(["mediatype", "value"]))

  return path
}
