/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Button,
  notification
} from 'antd'
import PageWrapper from '../../components/PageWrapper'
import { MdDelete, MdEditDocument } from 'react-icons/md'
import { FaSadCry, FaSmile } from 'react-icons/fa'
import handleApiCall from '../../api/handleApiCall'
import LoadingAnimation from '../../components/LoadingAnimation'
import { useTranslation } from 'react-i18next'

const Habits = () => {
  const [form] = Form.useForm()
  const [addForm] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const isEditing = record => record.key === editingKey
  const { t } = useTranslation()
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    // record,
    // index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`
              }
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    )
  }

  const cancel = () => {
    setEditingKey('')
  }

  const handleEdit = record => {
    form.setFieldsValue({
      name: '',
      description: '',
      target_value: null,
      ...record
    })
    setEditingKey(record.key)
  }

  // delete habit
  const handleDelete = key => {
    const dataSource = [...tableData]
    setTableData(dataSource.filter(item => item.key !== key))
    handleApiCall({
      urlType: 'deleteHabit',
      variant: 'habit',
      setLoading,
      urlParams: `${key}`,
      cb: (data, status) => {
        if (status === 200) {
          notification.open({
            message: 'Habit Deleted!',
            icon: <FaSmile className='text-green-500' />,
            description: 'Habit deleted successfully.'
          })
          fetchHabit()
        } else {
          openNotification()
        }
      }
    })
  }

  // edit save function
  const save = async key => {
    try {
      const row = await form.validateFields()
      const newData = [...tableData]
      const index = newData.findIndex(item => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row
        })
        const data = {
          description:
            tableData[index].description === row.description
              ? ''
              : row.description,
          target_value:
            tableData[index].target_value === row.target_value
              ? ''
              : row.target_value,
          name: tableData[index].name === row.name ? '' : row.name
        }

        // get only changed fields
        const changedData = {}
        for (const key in data) {
          if (data[key] !== '') {
            changedData[key] = data[key]
          }
        }

        handleApiCall({
          urlType: 'editHabit',
          variant: 'habit',
          setLoading,
          data: changedData,
          urlParams: `${key}`,
          cb: (data, status) => {
            if (status === 200) {
              notification.open({
                message: 'Habit Edited!',
                icon: <FaSmile className='text-green-500' />,
                description: 'Habit edited successfully.'
              })
              fetchHabit()
            } else {
              openNotification()
            }
          }
        })
        // setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        // setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: t('name'),
      dataIndex: 'name',
      width: '25%',
      editable: true
    },
    {
      title: t('description'),
      dataIndex: 'description',
      width: '40%',
      editable: true
    },
    {
      title: t('target value'),
      dataIndex: 'target_value',
      width: '15%',
      editable: true
    },
    {
      title: t('edit'),
      dataIndex: 'edit',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Typography.Link
              onClick={() => cancel()}
              className='!text-slate-800'
            >
              Cancel
            </Typography.Link>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ''}
            onClick={() => handleEdit(record)}
          >
            <MdEditDocument className='text-xl text-blue-500 hover:text-blue-400 cursor-pointer' />
          </Typography.Link>
        )
      }
    },
    {
      title: t('delete'),
      dataIndex: 'delete',
      render: (_, record) =>
        tableData.length >= 1 ? (
          <Popconfirm
            title='Sure to delete?'
            onConfirm={() => handleDelete(record.key)}
            okButtonProps={{
              className: 'bg-green-500 hover:!bg-green-400'
            }}
          >
            <MdDelete className='text-xl text-red-500 hover:text-red-400 cursor-pointer' />
          </Popconfirm>
        ) : null
    }
  ]

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'target_value' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  const openNotification = (status, type) => {
    notification.open({
      message: 'Something went wrong!',
      icon: <FaSadCry className='text-yellow-500' />,
      description:
        status === 400
          ? type === 'add'
            ? 'Duplicate Name!'
            : 'No records for Table'
          : 'Please try again or re-log to prevent this error',
      onClick: () => {
        console.log('Notification Clicked!')
      }
    })
  }

  // fetch all habits
  const fetchHabit = () => {
    handleApiCall({
      urlType: 'getUserHabit',
      variant: 'habit',
      setLoading,
      cb: (data, status) => {
        if (status === 200) {
          const modifiedData = data.result.map(item => ({
            ...item,
            key: item._id
          }))
          setTableData(modifiedData)
        } else {
          openNotification(status)
        }
      }
    })
  }

  // api call to get habit
  const onFinish = values => {
    handleApiCall({
      urlType: 'createHabit',
      variant: 'habit',
      setLoading,
      data: values,
      cb: (data, status) => {
        if (status === 200) {
          addForm.resetFields()
          notification.open({
            message: 'Habit Added!',
            icon: <FaSmile className='text-green-500' />,
            description: 'Habit added successfully.'
          })
          // update table
          fetchHabit()
        } else {
          openNotification(status, 'add')
        }
      }
    })
  }

  // log form errors
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  // api call to get profile
  const handleGetUser = () => {
    handleApiCall({
      urlType: 'getProfile',
      variant: 'user',
      setLoading,
      cb: (data, status) => {
        if (status === 200) {
          // update table
          localStorage.setItem('user_name', data.data.name)
        } else {
          openNotification()
        }
      }
    })
  }

  useEffect(() => {
    fetchHabit()
    handleGetUser()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageWrapper header={t('habits')}>
      {/* add form */}
      <LoadingAnimation loading={loading}>
        <Form
          form={addForm}
          name='add-habit'
          layout='inline'
          className='mb-16'
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name='name'
            label={t('name')}
            rules={[
              {
                required: true,
                message: 'Please input name!'
              }
            ]}
            className='xl:min-w-[25%]'
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='description'
            label={t('description')}
            rules={[
              {
                required: true,
                message: 'Please input description!'
              }
            ]}
            className='xl:min-w-[25%]'
            // wrapperCol={{
            //   span: 8
            // }}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='target_value'
            label={t('target value')}
            rules={[
              {
                required: true,
                message: 'Please input target value!'
              }
            ]}
            className='xl:min-w-[20%]'
            // wrapperCol={{
            //   span: 4
            // }}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              span: 24
            }}
          >
            <Button
              size='middle'
              type='primary'
              htmlType='submit'
              className=' w-[10rem] bg-blue-800'
            >
              {t('add')}
            </Button>
          </Form.Item>
        </Form>
      </LoadingAnimation>
      {/* table */}
      <Form form={form} component={false} name='table-edit'>
        <Table
          bordered
          loading={loading}
          size='small'
          components={{
            body: {
              cell: EditableCell
            }
          }}
          dataSource={tableData?.reverse()}
          columns={mergedColumns}
          rowClassName='editable-row'
          pagination={{
            onChange: cancel
          }}
        />
      </Form>
    </PageWrapper>
  )
}

export default Habits
