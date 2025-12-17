import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@/test/test-utils';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';
import ConversationsHeader from '../components/conversationlist/ConversationsHeader';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1.0';

describe('ConversationsHeader', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('should render Messages heading', () => {
    render(<ConversationsHeader />);
    expect(screen.getByText('Messages')).toBeInTheDocument();
  });

  it('should not show badge when no unseen conversations', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}/api/${API_VERSION}/conversations/unseen`,
        () => {
          return HttpResponse.json({
            status: 'success',
            unseenCount: 0,
          });
        }
      )
    );

    const { container } = render(<ConversationsHeader />);

    // Wait for the query to complete
    await waitFor(() => {
      const badge = container.querySelector('.bg-primary');
      expect(badge).not.toBeInTheDocument();
    });
  });

  it('should show unseen count when there are unseen conversations', async () => {
    server.use(
      http.get(
        `${API_BASE_URL}/api/${API_VERSION}/conversations/unseen`,
        () => {
          return HttpResponse.json({
            status: 'success',
            unseenCount: 3,
          });
        }
      )
    );

    render(<ConversationsHeader />);

    // Wait for the badge to appear with the count
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });
});
