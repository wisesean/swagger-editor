import { fromJS } from "immutable"
import { validateUrl } from "../helpers/validation-helpers"

export const licenseForm = (updateForm, path, existingValues) => 
  fromJS({
    value: { 
      name: {
        name: "名称",
        value: existingValues ? existingValues.get("name") : "", 
        isRequired: true, 
        updateForm: newForm => updateForm(newForm, path.concat(["value", "name"]))
      }, 
      url: {
        name: "URL",
        value: existingValues ? existingValues.get("url") : "", 
        hasErrors: !validateUrl(existingValues ? existingValues.get("url") : ""),
        updateForm: newForm => updateForm(newForm, path.concat(["value", "url"])),
        isValid: value => validateUrl(value),
        validationMessage: "请输入合法的URL."
      }
    }, 
    name: "License",
    description: "公开的 API 的许可证信息.",
    updateForm: newForm => updateForm(newForm, path)
  })

export const licenseObject = (formData) => {
  const name = formData.getIn(["value", "name", "value"])
  const url = formData.getIn(["value", "url", "value"])
  const newLicense = {}

  if (!name && !url) {
    return null
  }

  if (name) {
    newLicense.name = name
  }

  if (url) {
    newLicense.url = url
  }

  return newLicense
}