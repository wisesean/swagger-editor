import React, { Component } from "react"
import PropTypes from "prop-types"

import { pathForm, pathObject } from "./forms/form-objects/path-object"
import { operationForm, operationObject } from "./forms/form-objects/operation-object"
import { infoForm, infoObject } from "./forms/form-objects/info-object"
import { tagsForm, tagsObject } from "./forms/form-objects/tags-object"
import { serversForm, serversObject } from "./forms/form-objects/servers-object"
import { externalDocumentationForm, externalDocumentationObject } from "./forms/form-objects/external-documentation-object"
import { addOperationTagsForm, addOperationTagsObject } from "./forms/form-objects/add-operation-tags"
import { exampleForm, exampleObject } from "./forms/form-objects/example-value-object"
import { selectOperationObject } from "./forms/form-objects/select-operation"

export default class TopbarInsert extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddPathModal: false,
      showAddOperationModal: false,
      showAddInfoModal: false,
      showAddExternalDocsModal: false,
      showAddTagsModal: false,
      showAddServersModal: false,
      showAddOperationTagsModal: false
    }

    this.openModalClick = this.openModalClick.bind(this)
    this.closeModalClick = this.closeModalClick.bind(this)
    this.updatePath = this.updatePath.bind(this)
    this.updateExternalDocs = this.updateExternalDocs.bind(this)
    this.updateInfo = this.updateInfo.bind(this)
    this.getPaths = this.getPaths.bind(this)
    this.updateOperation = this.updateOperation.bind(this)
    this.updateServers = this.updateServers.bind(this)
    this.updateTags = this.updateTags.bind(this)
    this.addOperationTags = this.addOperationTags.bind(this)
    this.getResponses = this.getResponses.bind(this)
    this.getMediaTypes = this.getMediaTypes.bind(this)
    this.addExampleResponse = this.addExampleResponse.bind(this)
  }

  openModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: true
    })
  }

  closeModalClick = showModalProperty => () => {
    this.setState({
      [showModalProperty]: false
    })
  }

  updatePath = (formData) => {
    const pathFormObject = pathObject(formData)
    this.props.specActions.addToSpec(["paths"], pathFormObject.value, pathFormObject.key)
  }

  updateExternalDocs = (formData) => {
    this.props.specActions.addToSpec([], externalDocumentationObject(formData), "externalDocs")
  }

  updateInfo = (formData) => {
    this.props.specActions.addToSpec([], infoObject(formData), "info")
  } 

  getPaths = () => this.props.specSelectors.paths() ? Object.keys(this.props.specSelectors.paths().toJS()) : null

  addOperationTags(formData) {
    const operationTagsObject = addOperationTagsObject(formData)
    operationTagsObject.selectedOperation.push("tags")
    this.props.specActions.addToSpec(operationTagsObject.selectedOperation, operationTagsObject.tags, null)
  }

  getOperations = (path) => 
    path ? this.props.specSelectors.operations().toJS()
      .filter(item => item.path === path)
      .map(item => item.method) :
    null

  updateOperation = (formData) => {
    const path = formData.getIn(["path", "value"])

    if (!this.getPaths().includes(path)) {
      // Update json in the Swagger UI state with the new path.
      this.props.specActions.addToSpec(["paths"], null, path)
    }

    this.props.specActions.addToSpec(["paths", path], operationObject(formData), formData.getIn(["operation", "value"]))
  }

  updateServers = (formData) => {
    this.props.specActions.addToSpec(["servers"], serversObject(formData), null)
  }

  updateTags = (formData) => {
    this.props.specActions.addToSpec(["tags"], tagsObject(formData), null)
  }

  getResponses = (method, formData) => {
    // Operation = 'depends on' value
    // formData = all the data so far, process to get the response as well
    const operationPath = [...selectOperationObject(formData), "responses"]
    const responses = this.props.specSelectors.specJson().getIn(operationPath)

    if (!responses) {
      return []
    }

    return Object.keys(responses.toJS())
  }

  getMediaTypes = (response, formData) => {
    const defaultOptions = [
      "application/json", 
      "text/plain; charset=utf-8", 
      "application/xml" ]

    if (!formData) {  
      return defaultOptions
    }

    // Operation = 'depends on' value
    // formData = all the data so far, process to get the response as well
    const operationPath = [...selectOperationObject(formData), "responses"]
    const responses = this.props.specSelectors.specJson().getIn(operationPath)

    if (responses) {
      const response = responses.get(formData.getIn(["response", "value"]))

      if (response && response.has("content")) {
        const existing = Object.keys(response.get("content").toJS())
        const combined = defaultOptions.concat(existing)

        // Remove duplicates.
        return combined.filter((item, pos) => combined.indexOf(item) == pos)
      }
    }

    return defaultOptions
  }

  addExampleResponse = (formData) => {
    const formObject = exampleObject(formData)
    this.props.specActions.addToSpec(formObject.responsePath, { value: formObject.exampleValue }, formObject.exampleName)
  }

  render() {
    let { specSelectors, getComponent } = this.props

    const Modal = getComponent("TopbarModal")
    const Dropdown = getComponent("InsertDropdown")
    const DropdownItem = getComponent("InsertDropdownItem")
    const AddForm = getComponent("AddForm")

    if (!specSelectors.isOAS3()) {
      return null
    }

    return (
      <div>
        {this.state.showAddPathModal &&
          <Modal
            title="添加路径"
            onCloseClick={this.closeModalClick("showAddPathModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddPathModal")} 
              submitButtonText="添加路径" 
              getFormData={pathForm} 
              updateSpecJson={this.updatePath} 
            />
          </Modal>
        }
        { this.state.showAddOperationModal && 
        <Modal
          title="添加操作到文档"
          onCloseClick={this.closeModalClick("showAddOperationModal")}
        >
          <AddForm 
            {...this.props} 
            submit={this.closeModalClick("showAddOperationModal")} 
            submitButtonText="添加操作"
            getFormData={operationForm}
            updateSpecJson={this.updateOperation}
            existingData={this.getPaths()}
          />
        </Modal>
        }
        { this.state.showAddInfoModal &&
          <Modal
            title="添加基本信息到文档"
            onCloseClick={this.closeModalClick("showAddInfoModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddInfoModal")} 
              submitButtonText="添加基本信息"
              getFormData={infoForm}
              updateSpecJson={this.updateInfo}
              existingData={this.props.specSelectors.info()}
            />
          </Modal>
        }
        { this.state.showAddExternalDocsModal &&
          <Modal
            title="添加外部文档"
            onCloseClick={this.closeModalClick("showAddExternalDocsModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddExternalDocsModal")} 
              submitButtonText="添加外部文档"
              getFormData={externalDocumentationForm}
              updateSpecJson={this.updateExternalDocs}
            />
          </Modal>
        }
        { this.state.showAddTagsModal &&
          <Modal
            title="添加标签声明"
            onCloseClick={this.closeModalClick("showAddTagsModal")}
          >
            <AddForm
              {...this.props} 
              submit={this.closeModalClick("showAddTagsModal")} 
              submitButtonText="添加标签声明"
              getFormData={tagsForm}
              updateSpecJson={this.updateTags}
            />
          </Modal>
        }
        { this.state.showAddServersModal &&
          <Modal
            title="新增服务器"
            onCloseClick={this.closeModalClick("showAddServersModal")}
          >
            <AddForm 
              {...this.props} 
              submit={this.closeModalClick("showAddServersModal")} 
              submitButtonText="新增服务器"
              getFormData={serversForm}
              updateSpecJson={this.updateServers}            
            />
          </Modal>
        }
        { this.state.showAddOperationTagsModal && 
          <Modal
            title="添加标签到操作"
            onCloseClick={this.closeModalClick("showAddOperationTagsModal")}
            isShown
            isLarge
          >
            <AddForm
              {...this.props}
              submit={this.closeModalClick("showAddOperationTagsModal")}
              getFormData={addOperationTagsForm}
              existingData={{ getPaths: this.getPaths, getOperations: this.getOperations }}
              submitButtonText="添加标签到操作"
              updateSpecJson={this.addOperationTags}
            />
          </Modal>
        }
        { this.state.showAddExampleModal && 
          <Modal
            title="添加响应样例"
            description="API的一个样例响应"
            onCloseClick={this.closeModalClick("showAddExampleModal")}
            isShownisLarge
          >
            <AddForm
              {...this.props}
              submit={this.closeModalClick("showAddExampleModal")}
              getFormData={exampleForm}
              existingData={{ getPaths: this.getPaths, getOperations: this.getOperations, getResponses: this.getResponses, getMediaTypes: this.getMediaTypes }}
              submitButtonText="添加响应样例"
              updateSpecJson={this.addExampleResponse}
            />
          </Modal>
        }

        <Dropdown displayName="API文档编辑" >
          <DropdownItem onClick={this.openModalClick("showAddPathModal")} name="添加API路径"/>    
          <DropdownItem onClick={this.openModalClick("showAddOperationModal")} name="添加操作" />
          <DropdownItem onClick={this.openModalClick("showAddInfoModal")} name="添加基本信息" />
          <DropdownItem onClick={this.openModalClick("showAddExternalDocsModal")} name="添加外部文档" />
          <DropdownItem onClick={this.openModalClick("showAddTagsModal")} name="添加标签声明" />
          <DropdownItem onClick={this.openModalClick("showAddOperationTagsModal")} name="添加标签到操作" />
          <DropdownItem onClick={this.openModalClick("showAddServersModal")} name="新增服务器" />
          <DropdownItem onClick={this.openModalClick("showAddExampleModal")} name="添加响应样例" />
        </Dropdown>
      </div>
    )
  }
}

TopbarInsert.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({
    specJson: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    paths: PropTypes.func.isRequired,
    isOAS3: PropTypes.func.isRequired,
    operations: PropTypes.func.isRequired
  }),
  errSelectors: PropTypes.shape({
    allErrors: PropTypes.func.isRequired
  }),
  specActions: PropTypes.shape({
    addToSpec: PropTypes.func.isRequired
  })
}
