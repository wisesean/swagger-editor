import { fromJS } from "immutable"

export const selectOperationForm = (updateForm, path, existing) => (
  fromJS({ 
    path: { 
      value: "", 
      isRequired: true, 
      name: "路径",          
      description: "必填。API所在的路径.",
      updateForm: event => updateForm(event, path.concat(["path"])),
      validationMessage: "请选择一个路径。该字段为必填项.",
      options: existing ? existing.getPaths() : [],
      isValid: () => true
    },
    operation: { 
      value: "", 
      isRequired: true, 
      name: "操作",          
      description: "必填请选择一个操作.",
      updateForm: event => updateForm(event, path.concat(["operation"])),
      validationMessage: "请选择一个操作。该字段为必填项.",
      options: [],
      dependsOn: ["path", "value"],
      updateOptions: existing ? existing.getOperations : () => []
    }
  }))

export const selectOperationObject = (formData) => {
  const path = ["paths"]
  path.push(formData.getIn(["path", "value"]))
  path.push(formData.getIn(["operation", "value"]))

  return path
}
