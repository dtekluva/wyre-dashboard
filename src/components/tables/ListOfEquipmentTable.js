import { useState, useEffect, useContext } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Space, notification, Button} from 'antd';
import { mergeTheData } from '../../helpers/genericHelpers'
import equipmentHttpServices from '../../services/equipment'
import CompleteDataContext from '../../Context';

const DateWidget = (
  <input type="date" 
    className="generic-input"
    format="DD-MM-YYYY"
    id="equipment-purchase-date"
  />
);

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode =  inputType === 'date' ? DateWidget : inputType === 'number' ? <InputNumber /> : 
                    inputType === 'text' ? <Input/> :'';
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ListOfEquipmentTable = ({listOfEquipmentData}) => {
  const { token, userId } = useContext(CompleteDataContext);
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    const mergedData = mergeTheData(Object.values(listOfEquipmentData))
    const mapKeyToEachData = mergedData.map(element => {
        let branchIds = element.id
        const formattedData  = element.equipments.map((data)=>{ 
          Object.assign(data, {branch_id:branchIds})
        //Added key value to each object using their IDs. because this is what the edit() func uses to differentiate them. 
          Object.assign(data,{key:data.id}) 
          return data
        })
        return formattedData
    });
    const combineArray = [].concat(...mapKeyToEachData)
    setData(combineArray)
  },[listOfEquipmentData, userId, token])

  const openNotificationWithIcon = (type, message,desc) => {
    notification[type]({
      message: `${message}`,
      description:
        `${desc}`,
    });
  };
  

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      voltage: '',
      quantity: '',
      date_purchased:'',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };
  
  const deleteSelectedData = (item)=>{
    delete item.key;
    delete item.id;
    delete item.branch_id;
    return item
  }

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        let updatedData =  { ...item, ...row }
        newData.splice(index, 1, updatedData);
        setData(newData);
        setEditingKey('');
        equipmentHttpServices.update(userId,token,item.branch_id,item.id,deleteSelectedData(updatedData))
        openNotificationWithIcon('success','Success','Equipment edited successfully.')
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = async (key) => {
    const row = await form.validateFields();
    const dataSource = [...data];
    const index = dataSource.findIndex((item) => key === item.key);
    const item = dataSource[index];
    let DataToBeDeleted =  { ...item, ...row }
    setData(dataSource.filter((item) => item.key !== key))
    const delData = equipmentHttpServices.del(userId,item.id,token,item.branch_id,deleteSelectedData(DataToBeDeleted))

    if((await delData).status === 200){
      openNotificationWithIcon('info','Deleted','Equipment successfully deleted')
    }

    delData.catch((err)=>{
      console.log(err)
      openNotificationWithIcon('error','Error','An error occured, please check your Internet and try again')
    })
  };

  const columns = [
    {
      title: 'Equipment Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'Voltage (watts)',
      dataIndex: 'voltage',
      key: 'voltage',
      editable: true,
      width:'15%'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      editable:true,
      width:'15%'
    },
    {
      title: 'Date Purchased',
      dataIndex: 'date_purchased',
      key:'date_purchased',
      editable: true,
    },
    {
      title: 'Actions',
      dataIndex: 'operation',
      width:'25%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
                padding: 0,
                height: 'auto',
                lineHeight: 'inherit'
              }}
            >
              Save
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button
                type="link"
                style={{ padding: 0, height: 'auto', lineHeight: 'inherit' }}
              >
                Cancel
              </Button>
            </Popconfirm>
          </span>
        ) : (
        <Space>
          <Typography.Link disabled={editingKey !== ''} onClick={() => {
            edit(record)
            }} className="table-row-button" style={{width:'50px'}}>
            <span style={{marginRight:'150px'}}>Edit</span>
          </Typography.Link>
          
          <Typography.Link disabled={editingKey !== ''} onClick={() => {
            }} className="table-row-button" style={{width:'70px'}}>
            <Popconfirm title="Sure to delete?" onConfirm={()=>{
              handleDelete(record.key)
            }}>
              <span>Delete</span>
            </Popconfirm>
          </Typography.Link>
        </Space>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'date_purchased' ? 'date' : col.dataIndex === 'name' ? 'text' : 
                   col.dataIndex === 'voltage' || 'quantity' ? 'number' : '',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default ListOfEquipmentTable;

