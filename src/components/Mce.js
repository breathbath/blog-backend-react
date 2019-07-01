import React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {apiMakePost} from "./HttpClient";
import PropTypes from 'prop-types';

export default class Mce extends React.Component {
    render() {
        const options = {
            elementpath: false,
            branding: false,
            resize: true,
            statusbar: false,
            plugins: [
                "hr", "lists", "link", "image", "imagetools", "media", "charmap", "paste",
                "preview", "anchor", "pagebreak", "searchreplace",
                "visualblocks", "code", "fullscreen", "insertdatetime", "nonbreaking", "visualchars",
                "table", "emoticons", "codesample", "autolink", "spellchecker","autosave"
            ],
            menubar: 'file edit insert view format table tools',
            menu: {
                file: {title: 'File', items: 'newdocument'},
                edit: {
                    title: 'Edit',
                    items: 'undo redo | cut copy paste pastetext | selectall'
                },
                insert: {
                    title: 'Insert',
                    items: 'codesample link unlink media | template hr image charmap anchor pagebreak insertdatetime emoticons nonbreaking'
                },
                view: {
                    title: 'View',
                    items: 'visualaid preview visualblocks visualchars fullscreen'
                },
                format: {
                    title: 'Format',
                    items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'
                },
                table: {
                    title: 'Table',
                    items: 'inserttable tableinsertrowbefore tableinsertrowafter tableprops deletetable tablecellprops tablemergecells tablesplitcells tabledeleterow | cell row column'
                },
                tools: {title: 'Tools', items: 'code searchreplace'}
            },
            browser_spellcheck: true,
            contextmenu: true,
            height: 400,
            toolbar: [
                'formatselect | bold italic underline blockquote bullist numlist link alignleft aligncenter alignright alignjustify | image | indent outdent |code',
                'table| removeformat pastetext fullscreen restoredraft'
            ],
            autosave_interval: "10s",
            save_enablewhendirty: false,
            image_advtab: true,
            image_title: true,
            imagetools_toolbar: "rotateleft rotateright | flipv fliph | editimage imageoptions",
            codesample_languages: [
                {text: 'HTML/XML', value: 'markup'},
                {text: 'JavaScript', value: 'javascript'},
                {text: 'CSS', value: 'css'},
                {text: 'PHP', value: 'php'},
                {text: 'Go', value: 'go'},
                {text: 'C', value: 'c'},
                {text: 'C#', value: 'csharp'},
                {text: 'C++', value: 'cpp'}
            ],
            entity_encoding: 'named',
            image_class_list: [
                {title: 'Responsive', value: 'img-responsive'},
                {title: 'None', value: 'none'},
            ],
            image_dimensions: false,
            images_upload_handler: (blobInfo, success, failure) => {
                let formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());

                apiMakePost("/admin/files?format=mce", formData, true)
                    .then(
                        res => success(res.location),
                        res => failure(res.error)
                    );
            }
        };
        const finalOptions = Object.assign(options, this.props.options);
        return (
            <Editor
                value={this.props.value}
                init={finalOptions}
                textareaName={this.props.name}
                initialValue={this.props.initialValue}
                tagName={this.props.tagName}
            />
        );
    }
}

Mce.propTypes = {
    value: PropTypes.string,
    options: PropTypes.object,
    name: PropTypes.string,
    initialValue: PropTypes.string,
    tagName: PropTypes.string,
};