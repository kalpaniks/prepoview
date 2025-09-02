'use client';

import { useState } from 'react';
import { useShareManagement } from '@/hooks/useShareManagement';
import { CreateShareRequest } from '@/types/share';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Example component demonstrating share management functionality
 * This shows how to use the custom hooks we created
 */
export function ShareManagementExample() {
  const {
    shares,
    isLoading,
    error,
    createShare,
    updateShare,
    deleteShare,
    isCreating,
    isUpdating,
    isDeleting,
  } = useShareManagement();

  const [formData, setFormData] = useState<CreateShareRequest>({
    repoOwner: '',
    repoName: '',
    sharedWith: '',
    expirationDays: 7,
    viewLimit: 10,
  });

  const handleCreateShare = () => {
    createShare(formData);
    // Reset form
    setFormData({
      repoOwner: '',
      repoName: '',
      sharedWith: '',
      expirationDays: 7,
      viewLimit: 10,
    });
  };

  const handleUpdateShare = (id: number, updates: Partial<CreateShareRequest>) => {
    updateShare({ id, updates });
  };

  const handleDeleteShare = (id: number) => {
    if (confirm('Are you sure you want to delete this share?')) {
      deleteShare(id);
    }
  };

  if (isLoading) {
    return <div>Loading shares...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create Share Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Share</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Repository Owner"
              value={formData.repoOwner}
              onChange={(e) => setFormData({ ...formData, repoOwner: e.target.value })}
            />
            <Input
              placeholder="Repository Name"
              value={formData.repoName}
              onChange={(e) => setFormData({ ...formData, repoName: e.target.value })}
            />
          </div>
          <Input
            placeholder="Email to share with"
            value={formData.sharedWith}
            onChange={(e) => setFormData({ ...formData, sharedWith: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Expiration Days"
              value={formData.expirationDays}
              onChange={(e) =>
                setFormData({ ...formData, expirationDays: parseInt(e.target.value) })
              }
            />
            <Input
              type="number"
              placeholder="View Limit"
              value={formData.viewLimit}
              onChange={(e) => setFormData({ ...formData, viewLimit: parseInt(e.target.value) })}
            />
          </div>
          <Button onClick={handleCreateShare} disabled={isCreating} className="w-full">
            {isCreating ? 'Creating...' : 'Create Share'}
          </Button>
        </CardContent>
      </Card>

      {/* Shares List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Shares ({shares.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shares.map((share) => (
              <div
                key={share.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{share.repositoryName}</h3>
                  <p className="text-sm text-gray-600">Shared with: {share.sharedWith}</p>
                  <div className="mt-2 flex gap-2">
                    <Badge variant={share.status === 'active' ? 'default' : 'secondary'}>
                      {share.status}
                    </Badge>
                    <Badge variant="outline">
                      {share.viewCount}/{share.viewLimit} views
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateShare(share.id, { viewLimit: share.viewLimit + 5 })}
                    disabled={isUpdating}
                  >
                    Extend
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteShare(share.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {shares.length === 0 && <p className="text-center text-gray-500">No shares found</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
