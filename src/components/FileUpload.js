import React from 'react';
import {apiMakePost} from "./HttpClient";
import PropTypes from 'prop-types';
import {UploaderComponent, FilesPropModel} from "@syncfusion/ej2-react-inputs";
import {getToken} from "./TokenManager";

export default class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.onUploadSuccess = this.onUploadSuccess.bind(this);
        this.onUploadFailure = this.onUploadFailure.bind(this);
    }

    onUploadSuccess(args)  {
        console.log(args);
    }
    onUploadFailure(args)  {
        console.log(args);
    }

    addHeaders(args) {
        let req = args.currentRequest;
        req.setRequestHeader('Authorization', 'Bearer ' + getToken());
    }
    render() {
        let
            uploadPaths = {
                removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove',
                saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save'
            };
        let preloadFiles = [
            {name: 'Study materials', size: 500000, type: '.docx'},
        ];


        return (
            <UploaderComponent
            asyncSettings={uploadPaths}
            allowedExtensions='.doc, .docx, .xls, .xlsx'
            minFileSize={10000}
            maxFileSize={20000}
            success={this.onUploadSuccess}
            failure={this.onUploadFailure}
            files={preloadFiles}
            multiple={false}
            uploading={this.addHeaders}
            removing={this.addHeaders}
            />
        );
    }
}

FileUpload.propTypes = {
    value: PropTypes.string,
    options: PropTypes.object,
    name: PropTypes.string,
    initialValue: PropTypes.string,
    tagName: PropTypes.string,
};