import React, { useState } from 'react'

export default function CreateCategory() {
    const [formData, setFormData] = useState();
    const handleSubmit = async (e) => {
        e.preventDefault()

    }
    return (
        <>
            <form >

                <div>
                    <label for="name">Category Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter category name"
                        required
                    />
                </div>

                <div>
                    <label for="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        placeholder="Category description"
                    ></textarea>
                </div>

                <div>
                    <label for="buttonText">Button Text</label>
                    <input
                        type="text"
                        id="buttonText"
                        name="buttonText"
                        placeholder="Check"
                        value="Check"
                    />
                </div>

                <div>
                    <label for="displayOrder">Display Order</label>
                    <input
                        type="number"
                        id="displayOrder"
                        name="displayOrder"
                        value="10"
                        min="1"
                    />
                </div>

                <div>
                    <label for="leftImage">Left Image URL</label>
                    <input
                        type="text"
                        id="leftImage"
                        name="leftImage"
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label for="rightImage">Right Image URL</label>
                    <input
                        type="text"
                        id="rightImage"
                        name="rightImage"
                        placeholder="https://..."
                    />
                </div>

                <div>
                    <label for="horizontalTextPosition">Horizontal Text Position</label>
                    <select id="horizontalTextPosition" name="horizontalTextPosition">
                        <option value="LEFT">Left</option>
                        <option value="CENTER" selected>Center</option>
                        <option value="RIGHT">Right</option>
                    </select>
                </div>

                <div>
                    <label for="verticalTextPosition">Vertical Text Position</label>
                    <select id="verticalTextPosition" name="verticalTextPosition">
                        <option value="TOP">Top</option>
                        <option value="CENTER" selected>Center</option>
                        <option value="BOTTOM">Bottom</option>
                    </select>
                </div>

                <div>
                    <label for="status">Status</label>
                    <select id="status" name="status">
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <button type="submit">
                    Save Category
                </button>

            </form>

        </>
    )
}
