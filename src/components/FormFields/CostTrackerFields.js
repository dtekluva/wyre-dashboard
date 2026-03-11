import { Button, Form, Input, Upload } from "antd";
import path from 'path-browserify';
import { UploadOutlined } from '@ant-design/icons';
import { UPLOAD_PROPS } from "../../helpers/constants";
import EnvData from "../../config/EnvData";

const LIMIT_60_CHAR = 'File name should not have more than 60 characters';
const SUPPORTINGALLOWED = ['.png', '.jpg', '.jpeg'];

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};


const normFile = (event) => {
  if (Array.isArray(event)) {
    return event;
  }
  if (event.fileList.length > 1) {
    event.fileList.shift();
  }
  return event && event.fileList;
};


/**
 * @description field for the account number
 * @param {*} inputSize the input size
 * @param {*} data the data to be used to load/display the input
 * @param {*} required either required or not
 * @returns html contente needed
 */
export const SubmitButton = ({ buttonText = 'Submit', isLoading = false }) => (
  <Form.Item
    className='generic-submit-button-container'>
    <Button
      loading={isLoading}
      htmlType='submit'
      type="primary"
      className="generic-submit-button cost-tracker-form-submit-button">
      {buttonText}
    </Button>
  </ Form.Item>
);



/**
 * @description field for the account number
 * @param {*} inputSize the input size
 * @param {*} data the data to be used to load/display the input
 * @param {*} required either required or not
 * @returns html contente needed
 */
export const InputField = ({ data, inputSize = 'large', required = true }) => (
  <Form.Item
    label={data.label}
    name={data.name}
    labelCol={{ span: 24 }}
    hasFeedback
    validateTrigger={['onChange', 'onBlur']}
    rules={[
      ...(required ? [{ required: true, message: `Please enter the ${data.label} ` }] : []),
      { max: data.max, message: `${data.label} Cannot be more than ${data.max} characters` },
    ]}
  >
    <Input
      placeholder={data.placeholder}
      size={inputSize}
    />
  </Form.Item>
);


export const FlowMeterUpload = ({
  badFileHeader,
  setBadFileHeader, inputSize
}) => (
  <Form.Item
    label="Flow Meter Snapshot"
    name="flowMeterUpload"
    getValueFromEvent={normFile}
    valuePropName={'fileList'}
    labelCol={{ span: 24 }}
    rules={[
      () => ({
        validator(rule, value) {
          if (value) {
            if (value[0]?.size >= Number(EnvData.REACT_APP_UPLOAD_LIMIT) * (1024 * 1024)) {
              return Promise.reject(new Error(
                `The size of the files you are uploading is over the allowed limit of ${EnvData
                  .REACT_APP_UPLOAD_LIMIT}`,
              ));
            }
          }
          if (badFileHeader) {
            return Promise.reject(
              badFileHeader,
            );
          }
          return Promise.resolve();
        },
      }),
      ...([{ required: true, message: 'Please add a Flow Meter napshot' }]),
    ]}
  >
    <Upload
      customRequest={dummyRequest}
      beforeUpload={async (file) => {
        setBadFileHeader(false);
        const pathName = path.extname(file.name);
        if (!SUPPORTINGALLOWED.includes(pathName.toLowerCase())) {
          file.isBad = true;
          return setBadFileHeader('only images are allowed');
        }

        if (file.name.length > 60) {
          return setBadFileHeader(LIMIT_60_CHAR);
        }
        return false;
      }}
      onRemove={() => {
        setBadFileHeader(false);
      }}
      maxCount={1}
      className='flow-meter-upload-file'
      // name="upload"
      {...UPLOAD_PROPS}
      accept="image/png, image/jpeg"
      placeholder="Click to Upload"
      size={inputSize}
      multiple={false}
    >
      <Button
        style={{
          width: '100%',
          textAlign: 'left',
          borderRadius: '5px',
          height: 40
        }}
        icon={<UploadOutlined />}
      >
        Click to upload
      </Button>
    </Upload>
  </Form.Item>
);
