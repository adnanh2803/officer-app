import { useEffect, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
// import ImageUploader from "../ImageUploader/ImageUploader";
function CoreModal({ handleClose, show, isInEdit, modalProp, apiService, rowData, parentId, title }) {
    //props needed for modal are:
    //  isInEdit(true/false)
    //  fieldProp(Array of Objects containing Field name, ControlType and Data if exits)
    const [fieldData, setFieldData] = useState()
    const [isSubmiting, setIsSubmiting] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    async function getOptionsFromDataSource(dataSource) {
        let options = await dataSource.get();
        if (!options?.length > 0) return []
        return options.map((option) => {
            return { Name: option.Name, Value: option._id }
        })
    }

    async function tranformData(data) {
        if (modalProp) {
            return await Promise.all(Object.entries(modalProp).map(async (e) => {
                let options = e[1].DataSource && await getOptionsFromDataSource(e[1].DataSource)
                return {
                    RealName: e[0],
                    Name: e[1].Name,
                    Value: isInEdit ? data[e[0]] : "",
                    ControlType: e[1].ControlType,
                    Options: e[1].Options ? e[1].Options : options,
                    Required: e[1].Required,
                    Validate: e[1].Validate
                }
            }));
        }
        return []
    }

    useEffect(() => {
        async function getFields() {
            setIsLoading(true)
            let tranformedData = await tranformData(rowData);
            console.log(tranformedData)
            setFieldData([...tranformedData])
            setIsLoading(false)
        }
        if(show) getFields();
    }, [show])

    const getRealOptionValue = function(e, field){
        const optionName = e.target.value;
        const option = field.Options.find((opt)=>{
            return opt.Name == optionName
        })
        return option?.Value || ""
    }

    const updateFieldOnChange = function (newValue, field) {
        const index = fieldData.indexOf(field)
        const newData = [...fieldData]
        field.Value = newValue
        newData[index] = field
        setFieldData(newData)
    }

    const getOptionsForSelect = function (prop) {
        if (!prop) return
        let defaultOption = (<option key={'def'} value="">-</option>)
        return ([defaultOption, [...prop.map(value => {
            return (<option key={value.Value}>{value.Name}</option>)
        })]])
    }

    const submitData = async function (event) {
        event.preventDefault();
        try{
            fieldData.some((field)=> {return field.Validate && typeof field.Validate == "function" ? !field.Validate() : false})
            setIsSubmiting(true);
            let data = fieldData.reduce(
                (obj, item) => Object.assign(obj, { [item.RealName]: item.Value }), {})
            isInEdit ? await apiService.update({ ...data, _id: rowData._id }) : await apiService.create(data, parentId)
            handleClose(true);
        }catch(error){
            console.log(error)
        }
        finally{
            setIsSubmiting(false);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isInEdit ? `Edit ${title}` : `New ${title}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="group-form" onSubmit={submitData}>
                        {fieldData &&
                            !isLoading &&
                            fieldData.map((field) => {
                                return (
                                    <Form.Group
                                        key={field._id || field.Name}
                                        className="mb-3"
                                        controlId="itemGroupName"
                                    >
                                        <Form.Label style={{ color: "#333", fontWeight: 500 }}>
                                            {field.Name}
                                        </Form.Label>
                                        {(field.ControlType == "Text" || field.ControlType == "Date")  && (
                                            <Form.Control
                                                key={field._id || field.Name}
                                                name={field.Name}
                                                type={field.ControlType}
                                                value={field?.Value}
                                                placeholder={
                                                    "Enter " + field.Name
                                                }
                                                required = {field.Required}
                                                onChange={(e) =>
                                                    updateFieldOnChange(
                                                        e.target.value,
                                                        field
                                                    )
                                                }
                                            />
                                        )}
                                        {field.ControlType == "Select" && (
                                            <Form.Select
                                                // value={field?.Value}
                                                key={field._id || field.Name}
                                                required = {field.Required}
                                                onChange={(e) => {
                                                    const realValue = getRealOptionValue(e,field)
                                                    updateFieldOnChange(
                                                        realValue,
                                                        field
                                                    )
                                                }
                                                }
                                            >
                                                {getOptionsForSelect(
                                                    field.Options
                                                )}
                                            </Form.Select>
                                        )}
                                        {/* {field.ControlType == "ImageUploader" && (
                                                <ImageUploader key={field._id || field.Name}></ImageUploader>
                                        ) 
                                        } */}
                                    </Form.Group>
                                );
                            })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={isSubmiting}
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    <Button
                        form="group-form"
                        type="submit"
                        variant="primary"
                        disabled={isSubmiting}
                    >
                        {isInEdit ? "Update" : "Create"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CoreModal;
