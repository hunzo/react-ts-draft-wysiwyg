import React, { useState } from 'react'
import './App.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState } from 'draft-js'
import { convertToHTML } from 'draft-convert'

const App: React.FC = () => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    )
    const UploadImage = (file: Blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                resolve({
                    data: {
                        link: reader.result,
                    },
                })
            }
            reader.readAsDataURL(file)
            reader.onerror = (err) => reject(err)
        })
    }

    const html = convertToHTML({
        entityToHTML: (entity) => {
            if (entity.type === 'IMAGE') {
                // console.log(entity.data)

                // const alignment = entity.data.alignment || 'none' || 'undefined'
                // const textAlign = alignment === 'none' ? 'center' : alignment

                console.log(entity.data.alignment)

                return `
                    <p style="${entity.data.alignment}">
                        <img
                            src="${entity.data.src}"
                            width="${entity.data.width}"
                            height="${entity.data.height}"
                        />
                    </p>
                `
            }
        },
    })(editorState.getCurrentContent())

    return (
        <div className="App">
            <Editor
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={setEditorState}
                toolbar={{
                    options: [
                        'blockType',
                        'fontSize',
                        'inline',
                        'fontFamily',
                        'list',
                        'textAlign',
                        'colorPicker',
                        'link',
                        'embedded',
                        'emoji',
                        'image',
                        'history',
                    ],
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: {
                        urlEnabled: true,
                        uploadEnabled: true,
                        uploadCallback: UploadImage,
                        previewImage: true,
                        alt: { present: false, mandatory: false },
                    },
                }}
            />
            <pre style={{ border: '1px solid #e1e1e1', margin: '1rem' }}>
                {JSON.stringify(html)}
            </pre>
            <pre style={{ border: '1px solid #e1e1e1', margin: '1rem' }}>
                {JSON.stringify(
                    convertToRaw(editorState.getCurrentContent()),
                    null,
                    2
                )}
            </pre>
        </div>
    )
}

export default App
