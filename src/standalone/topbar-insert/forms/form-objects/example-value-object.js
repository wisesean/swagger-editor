import { fromJS } from "immutable"
import { selectResponseObject, selectResponseForm } from "./select-response"

export const exampleForm = (updateForm, path, existing) => (
  fromJS({
    selectresponse: {
      name: "选择响应",
      value: selectResponseForm(updateForm, path.concat(["selectresponse", "value"]), existing),
      isRequired: true,
      description: "在文档中选择要添加示例的位置。"
    },
    exampleName: {
      name: "示例名称",
      description: "响应的名称",
      value: "",
      updateForm: event => updateForm(event, path.concat(["exampleName"])),
      isRequired: true,
      dependsOn: ["selectresponse", "value", "mediatype", "value"]
    },
    exampleValue: {
      name: "示例值",
      value: "",
      bigTextBox: true,
      updateForm: event => updateForm(event, path.concat(["exampleValue"])),
      description: "示例响应的值。这可以是任意字符串，json，xml等。",
      isRequired: true,
      dependsOn: ["selectresponse", "value", "mediatype", "value"]
    }
  })
)

export const exampleObject = (formData) => {
  const responsePath = selectResponseObject(formData.getIn(["selectresponse", "value"]))
  const exampleName = formData.getIn(["exampleName", "value"])
  const exampleValue = formData.getIn(["exampleValue", "value"])

  return {
    responsePath: [...responsePath, "examples"],
    exampleName,
    exampleValue
  }
}