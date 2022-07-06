import { fromJS } from "immutable"

export const externalDocumentationForm = (updateForm, path) => 
  fromJS({
    url: {
      value: "",
      isRequired: true, 
      name: "URL",
      description: "必填。目标文档的 URL。值必须采用 URL 的格式。",
      updateForm: event => updateForm(event, path.concat(["url"])),
      validationMessage: "请输入合法的URL."
    },
    description: {
      value: "",
      name: "描述",
      description: "目标文档的简短说明。通用标记语法可用于富文本表示。",
      updateForm: event => updateForm(event, path.concat(["description"]))
    }
  })

export const externalDocumentationObject = (formData) => { 
  const url = formData.getIn(["url", "value"])
  const description = formData.getIn(["description", "value"])

  if (!url && !description) {
    return null
  }

  const externalDocumentation = {}

  if (url) {
    externalDocumentation.url = url
  }

  if (description) {
    externalDocumentation.description = description
  }

  return externalDocumentation
}
