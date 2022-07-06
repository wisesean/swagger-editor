import { fromJS } from "immutable"
import { externalDocumentationObject, externalDocumentationForm } from "./external-documentation-object"

export const tagForm = (updateForm, path) => 
  fromJS({ 
    name: {
      value: "",
      isRequired: true, 
      name: "名称",
      description: "必填，标签的名称.",
      validationMessage: "请输入标签名称。",
      updateForm: newForm => updateForm(newForm, path.concat(["name"]))
    },
    description: {
      value: "",
      name: "描述",
      description: "标记的简短说明。通用标记语法可用于富文本表示。",
      updateForm: newForm => updateForm(newForm, path.concat(["description"]))
    },
    externalDocs: {
      value: externalDocumentationForm(updateForm, path.concat(["externalDocs", "value"])),
      name: "外部文档",
      updateForm: newForm => updateForm(newForm, path.concat(["externalDocs"]))
    }
  })

export const tagObject = (formData) => {
  const name = formData.getIn(["name", "value"])
  const description = formData.getIn(["description", "value"])
  const externalDocs = formData.getIn(["externalDocs", "value"])

  const externalDocsObject = externalDocumentationObject(externalDocs)
  const tagObject = {}

  if (!name && !description && !externalDocsObject) {
    return null
  }

  if (name) {
    tagObject.name = name
  }

  if (description) {
    tagObject.description = description
  }

  if (externalDocsObject) {
    tagObject.externalDocs = externalDocsObject
  }

  return tagObject
}
