import '../budgetModel/BudgetModal.css'

/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal'

const BudgetModal = (props) => {
  const { show, onHide, mode, departmentData, onSuccess } = props
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentCode: '',
    description: '',
  })
  const [error, setError] = useState('')

  // Pre-fill form data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && departmentData) {
      setFormData({
        departmentName: departmentData.departmentName || '',
        departmentCode: departmentData.departmentCode || '',
        description: departmentData.description || '',
      })
    } else {
      // Reset form data for add mode
      setFormData({
        departmentName: '',
        departmentCode: '',
        description: '',
      })
    }
    setError('') // Clear errors when modal opens
  }, [mode, departmentData, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError('') // Clear error when user starts typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.departmentName.trim()) {
      setError('Department name is required')
      return
    } else if (!formData.departmentCode.trim()) {
      setError('Department Code is required')
      return
    }

    setLoading(true)
    try {
      if (mode === 'add') {
        console.log()
      } else if (mode === 'edit') {
        console.log()
      }
      onSuccess() // Call success callback
      onHide() // Close modal
    } catch (err) {
      setError(err.message || 'Failed to save department')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="text-center">
        <div className="group">
          <div>
            <h3>{mode === 'add' ? 'New Department' : 'Edit Department'}</h3>
            <hr />
          </div>
          <div className="row no-gutters">
            <div className="col-lg-12">
              <div className="form-wizard">
                <form onSubmit={handleSubmit}>
                  <fieldset className="wizard-fieldset show">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="form-group">
                          <input
                            type="text"
                            name="departmentName"
                            id="departmentName"
                            className={error ? 'error' : ''}
                            placeholder=" "
                            value={formData.departmentName}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <label className="wizard-form-text-label">
                            Department Name
                          </label>
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="form-group">
                          <input
                            type="text"
                            name="departmentCode"
                            id="departmentCode"
                            className={error ? 'error' : ''}
                            placeholder=" "
                            value={formData.departmentCode}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <label className="wizard-form-text-label">
                            Department Code
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="form-group">
                          <input
                            type="text"
                            name="description"
                            id="description"
                            className={error ? 'error' : ''}
                            placeholder=" "
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                          />
                          <label className="wizard-form-text-label">
                            Description
                          </label>
                        </div>
                      </div>
                    </div>
                  </fieldset>
                  {error && <p className="text-danger">{error}</p>}
                  <div className="btn-group">
                    <button
                      variant="outlined"
                      className="btnInfo"
                      onClick={onHide}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="btnSuccess"
                      disabled={loading}
                    >
                      {loading
                        ? 'Submitting...'
                        : mode === 'add'
                          ? 'Add'
                          : 'Update'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default BudgetModal
