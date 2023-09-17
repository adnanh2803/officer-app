import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'
import './CoreTable.scss'

function CoreTableTools({crudPrivilages,create, remove}) {
    
    return (
        <div className='ToolBar'>
            { crudPrivilages && crudPrivilages.includes('CREATE') && 
                <FontAwesomeIcon onClick={create} icon={faPlusCircle} />
            }
            { crudPrivilages && crudPrivilages.includes('DELETE') && 
                 <FontAwesomeIcon onClick={remove}icon={faMinusCircle} />
            }   
        </div>
    )
}

export default CoreTableTools