'use client';

import React, { useState } from 'react';
import XModal from '@/components/ui/hoc/XModal';
import Button from '@/components/ui/Button';
import { InputField } from '@/components/ui/input';
import { Divider } from '@/components/ui/Divider';
import { XLogo } from '@/components/ui/icons';

export function XModalDemo() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  const openModal = (modalType: string) => setActiveModal(modalType);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <XLogo className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            XModal Components Demo
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore all modal variants including confirmation, form, info,
            error, success, and more. All modals are fully functional and
            interactive.
          </p>
        </div>

        {/* Confirmation Modals */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Confirmation Modals
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="primary"
                onClick={() => openModal('delete-confirmation')}
              >
                Delete Confirmation
              </Button>
              <Button
                variant="primary"
                onClick={() => openModal('logout-confirmation')}
              >
                Logout Confirmation
              </Button>
              <Button
                variant="primary"
                onClick={() => openModal('discard-confirmation')}
              >
                Discard Changes
              </Button>
            </div>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Info & Alert Modals */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Info & Alert Modals
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="primary" onClick={() => openModal('success')}>
                Success Modal
              </Button>
              <Button variant="primary" onClick={() => openModal('error')}>
                Error Modal
              </Button>
              <Button variant="primary" onClick={() => openModal('warning')}>
                Warning Modal
              </Button>
              <Button variant="primary" onClick={() => openModal('info')}>
                Info Modal
              </Button>
            </div>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Form Modals */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Form Modals
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="primary"
                onClick={() => openModal('contact-form')}
              >
                Contact Form
              </Button>
              <Button
                variant="primary"
                onClick={() => openModal('edit-profile')}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        <Divider className="my-12" />

        {/* Size Variations */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Size Variations
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="primary" onClick={() => openModal('size-sm')}>
                Small Modal
              </Button>
              <Button variant="primary" onClick={() => openModal('size-md')}>
                Medium Modal
              </Button>
              <Button variant="primary" onClick={() => openModal('size-lg')}>
                Large Modal
              </Button>
              <Button variant="primary" onClick={() => openModal('size-xl')}>
                Extra Large
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <XModal
          isOpen={activeModal === 'delete-confirmation'}
          onClose={closeModal}
          title="Delete post?"
          size="sm"
        >
          <p className="text-text-secondary text-[15px] mb-6">
            This can&#39;t be undone and it will be removed from your profile,
            the timeline of any accounts that follow you, and from search
            results.
          </p>
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={closeModal}>
              Delete
            </Button>
            <Button variant="outline" fullWidth onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </XModal>

        {/* Logout Confirmation Modal */}
        <XModal
          isOpen={activeModal === 'logout-confirmation'}
          onClose={closeModal}
          title="Log out of X?"
          size="sm"
        >
          <p className="text-text-secondary text-[15px] mb-6">
            You can always log back in at any time. If you just want to switch
            accounts, you can do that by adding an existing account.
          </p>
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={closeModal}>
              Log out
            </Button>
            <Button variant="outline" fullWidth onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </XModal>

        {/* Discard Changes Modal */}
        <XModal
          isOpen={activeModal === 'discard-confirmation'}
          onClose={closeModal}
          title="Discard changes?"
          size="sm"
        >
          <p className="text-text-secondary text-[15px] mb-6">
            This can&#39;t be undone and you&#39;ll lose your changes.
          </p>
          <div className="space-y-3">
            <Button variant="primary" fullWidth onClick={closeModal}>
              Discard
            </Button>
            <Button variant="outline" fullWidth onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </XModal>

        {/* Success Modal */}
        <XModal
          isOpen={activeModal === 'success'}
          onClose={closeModal}
          title="Success!"
          size="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-text-secondary text-[15px] mb-6">
              Your changes have been saved successfully!
            </p>
            <Button variant="primary" fullWidth onClick={closeModal}>
              Done
            </Button>
          </div>
        </XModal>

        {/* Error Modal */}
        <XModal
          isOpen={activeModal === 'error'}
          onClose={closeModal}
          title="Error"
          size="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-text-secondary text-[15px] mb-6">
              Something went wrong. Please try again later.
            </p>
            <Button variant="primary" fullWidth onClick={closeModal}>
              Try Again
            </Button>
          </div>
        </XModal>

        {/* Warning Modal */}
        <XModal
          isOpen={activeModal === 'warning'}
          onClose={closeModal}
          title="Warning"
          size="sm"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-text-secondary text-[15px] mb-6">
              This action requires your attention. Please review before
              proceeding.
            </p>
            <div className="space-y-3">
              <Button variant="primary" fullWidth onClick={closeModal}>
                Proceed
              </Button>
              <Button variant="outline" fullWidth onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </XModal>

        {/* Info Modal */}
        <XModal
          isOpen={activeModal === 'info'}
          onClose={closeModal}
          title="Information"
          size="md"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-text-secondary text-[15px] mb-6">
              This is an informational modal. It can be used to display
              important information, tips, or announcements to users.
            </p>
            <Button variant="primary" fullWidth onClick={closeModal}>
              Got it
            </Button>
          </div>
        </XModal>

        {/* Contact Form Modal */}
        <XModal
          isOpen={activeModal === 'contact-form'}
          onClose={closeModal}
          title="Contact Us"
          size="md"
        >
          <div className="space-y-4">
            <InputField
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <InputField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <div className="pt-4 space-y-3">
              <Button variant="primary" fullWidth onClick={closeModal}>
                Submit
              </Button>
              <Button variant="outline" fullWidth onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </XModal>

        {/* Edit Profile Modal */}
        <XModal
          isOpen={activeModal === 'edit-profile'}
          onClose={closeModal}
          title="Edit Profile"
          size="lg"
        >
          <div className="space-y-4">
            <InputField
              label="Display Name"
              type="text"
              value=""
              onChange={() => {}}
              maxLength={50}
              showCharCount
            />
            <InputField
              label="Bio"
              type="text"
              value=""
              onChange={() => {}}
              maxLength={160}
              showCharCount
            />
            <InputField
              label="Website"
              type="url"
              value=""
              onChange={() => {}}
            />
            <div className="pt-4 space-y-3">
              <Button variant="primary" fullWidth onClick={closeModal}>
                Save Changes
              </Button>
              <Button variant="outline" fullWidth onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </div>
        </XModal>

        {/* Size Variations Modals */}
        <XModal
          isOpen={activeModal === 'size-sm'}
          onClose={closeModal}
          title="Small Modal"
          size="sm"
        >
          <p className="text-text-secondary text-[15px] mb-4">
            This is a small modal (max-w-sm). Perfect for simple confirmations
            and alerts.
          </p>
          <Button variant="primary" fullWidth onClick={closeModal}>
            Close
          </Button>
        </XModal>

        <XModal
          isOpen={activeModal === 'size-md'}
          onClose={closeModal}
          title="Medium Modal"
          size="md"
        >
          <p className="text-text-secondary text-[15px] mb-4">
            This is a medium modal (max-w-md). Great for forms and moderate
            content.
          </p>
          <Button variant="primary" fullWidth onClick={closeModal}>
            Close
          </Button>
        </XModal>

        <XModal
          isOpen={activeModal === 'size-lg'}
          onClose={closeModal}
          title="Large Modal"
          size="lg"
        >
          <p className="text-text-secondary text-[15px] mb-4">
            This is a large modal (max-w-lg). Suitable for detailed forms and
            extensive content.
          </p>
          <Button variant="primary" fullWidth onClick={closeModal}>
            Close
          </Button>
        </XModal>

        <XModal
          isOpen={activeModal === 'size-xl'}
          onClose={closeModal}
          title="Extra Large Modal"
          size="xl"
        >
          <p className="text-text-secondary text-[15px] mb-4">
            This is an extra large modal (max-w-xl). Best for complex forms and
            rich content displays.
          </p>
          <Button variant="primary" fullWidth onClick={closeModal}>
            Close
          </Button>
        </XModal>

        {/* Navigation */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/demo"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              ← Back to Demos
            </a>
            <a
              href="/demo/buttons"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Button Components
            </a>
            <a
              href="/demo/inputs"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Input Components
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
