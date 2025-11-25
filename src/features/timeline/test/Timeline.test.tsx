import '@testing-library/jest-dom';
import {
  fireEvent,
  getAllByTestId,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import Header from '../components/Header';
import { useSelectedTab } from '../store/useTimelineStore';
import { FOLLOWING_TAB, FOR_YOU_TAB } from '../constants/menuName';
import { TIMELINE_ENDPOINTS } from '../constants/api';
import { API_CONFIG } from '@/constants/api';
import { render as customRender } from '@/test/test-utils';
import TweetList from '../components/TweetList';
import ProfileLogo from '@/components/ui/home/ProfileLogo';
import { useAuth } from '@/features/authentication/hooks';
import AddTweet from '../components/AddTweet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAddTweetStore from '../store/useAddTweetStore';
import { options } from '../constants/replySettingsOptions';
import useMedia from '@/features/media/store/useMedia';
import { useAddTweet } from '../hooks/timelineQueries';
import { image1, image2, image3, image4, image5, tweet } from '../mocks/data';
import {
  MAX_TWEET_LENGTH,
  MAX_WARNING_TWEET_LENGTH,
} from '../constants/tweetConstants';

// npx jest pathToFoler
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
beforeAll(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = 'localhost/500';
  process.env.NEXT_PUBLIC_API_VERSION = 'v1.0';
});

const queryClient1 = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient1}>{children}</QueryClientProvider>
  );
};
describe('render Timeline Header ', () => {
  it('render header component', () => {
    const { getByTestId } = render(<Header />);
    const header = getByTestId('timeline-header');
    expect(header).toBeInTheDocument();
  });
  it('render Tabs in header', () => {
    const { getByTestId, getAllByTestId } = render(<Header />);
    const timelineTab = getByTestId('timeline-header');
    const tabs = getAllByTestId(/tab/);
    const tab1 = getByTestId('following-tab');
    const tab2 = getByTestId('for-you-tab');
    expect(timelineTab).toBeInTheDocument();
    expect(tab1).toBeInTheDocument();
    expect(tab2).toBeInTheDocument();
    expect(tabs.length).toBe(2);
  });
  it('selcect tab in header', () => {
    const { getByTestId } = render(<Header />);
    const tab1 = getByTestId('following-tab');
    const tab2 = getByTestId('for-you-tab');

    fireEvent.click(tab2);
    const { result: resultForU } = renderHook(() => useSelectedTab());
    const tabForU = resultForU.current;
    expect(tabForU).toBe(FOR_YOU_TAB);
    fireEvent.click(tab1);
    const { result: resultFollowing } = renderHook(() => useSelectedTab());
    const tabFollowing = resultFollowing.current;
    expect(tabFollowing).toBe(FOLLOWING_TAB);
  });
  it('expecting calling api when select tab', async () => {
    global.fetch = jest.fn();
    const { getByTestId } = render(<Header />);
    customRender(<TweetList />);
    const tab2 = getByTestId('for-you-tab');
    console.log(global.fetch);
    expect(global.fetch).toHaveBeenCalledWith(
      API_CONFIG.BASE_URL +
        TIMELINE_ENDPOINTS.TIMELINE_FEED_FLLOWING +
        '?page=1&limit=10',
      expect.anything()
    );

    fireEvent.click(tab2);
    expect(global.fetch).toHaveBeenCalledWith(
      API_CONFIG.BASE_URL +
        TIMELINE_ENDPOINTS.TIMELINE_FEED_FOR_YOU +
        '?page=1&limit=10',
      expect.anything()
    );
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('test add tweet component', () => {
  it('test click profile picture to route to profile', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    const mockUser = {
      id: 7,
      username: 'yousef07',
      role: 'user',
      email: 'yousef@gmail.com',
      profile: {
        name: 'Yousef Adel',
        profileImageUrl: null,
        birthDate: null, // ISO date string
      },
      onboardingStatus: undefined,
    };
    result.current.setUser(mockUser);
    const { getByTestId } = customRender(<ProfileLogo />);
    const logo = getByTestId('profile-logo');
    const link = getByTestId('profile-logo-link');
    fireEvent.click(link);
    expect(logo).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe(`./${mockUser.username}`);
  });

  it('check default selected option and should appear after first click', () => {
    const { getByTestId, queryByTestId } = render(<AddTweet />, {
      wrapper,
    });
    const { result } = renderHook(() => useAddTweetStore(), { wrapper });
    const addTweetContainer = getByTestId('add-tweet-container');
    expect(addTweetContainer).toBeInTheDocument();
    expect(queryByTestId('tweet-reply-settings')).not.toBeInTheDocument();
    expect(result.current.selectedReplyOption).toBe(0);
    fireEvent.click(addTweetContainer);
    expect(result.current.selectedReplyOption).toBe(1);
    const reply = getByTestId('tweet-reply-settings');
    expect(reply).toBeInTheDocument();
  });

  it('check selecting reply option ', () => {
    const { getByTestId, queryByTestId } = render(<AddTweet />, {
      wrapper,
    });
    const { result } = renderHook(() => useAddTweetStore(), { wrapper });
    expect(queryByTestId('reply-menu-list')).not.toBeInTheDocument();
    const replyButton = getByTestId('tweet-reply-settings-button');
    expect(replyButton).toBeInTheDocument();
    const selectedReply = getByTestId('selected-reply');
    expect(selectedReply.innerHTML).toBe(options[0].value + ' can reply');
    fireEvent.click(replyButton);
    expect(getByTestId('reply-menu-list')).toBeInTheDocument();
    const replyList = getByTestId('reply-menu-items');
    expect(replyList).toBeInTheDocument();
    expect(replyList.childNodes.length).toBe(4);
    expect(result.current.selectedReplyOption).toBe(1);
    expect(
      getByTestId(
        'selected-reply-' + options[0].value.toLowerCase().replace(/\s+/g, '-')
      )
    ).toBeInTheDocument();
    options.forEach((option) => {
      fireEvent.click(
        getByTestId(
          'reply-option-' + option.value.toLowerCase().replace(/\s+/g, '-')
        )
      );
      expect(result.current.selectedReplyOption).toBe(option.id);
      expect(selectedReply.innerHTML).toBe(option.value + ' can reply');
      fireEvent.click(replyButton);
      expect(
        getByTestId(
          'selected-reply-' + option.value.toLowerCase().replace(/\s+/g, '-')
        )
      ).toBeInTheDocument();
    });
  });
});

describe('send post', () => {
  it('test try to add empty tweet', () => {
    global.fetch = jest.fn();
    const { getByTestId } = render(<AddTweet />, { wrapper });
    const { result } = renderHook(() => useAddTweetStore(), { wrapper });
    console.log(result.current.isSending);
    const submitButton = getByTestId('button-Post');
    fireEvent.click(submitButton);
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(global.fetch).not.toHaveBeenCalledWith(
      API_CONFIG.BASE_URL + TIMELINE_ENDPOINTS.ADD_TWEET
    );
  });
  beforeEach(() => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            status: 'success',
            message: 'Post created successfully',
            data: tweet,
          }),
      })
    );
    global.URL.createObjectURL = jest.fn();
  });
  it('try to send post with only media and clear media after post ( which is valid :) )', async () => {
    const { getByTestId, queryByTestId } = render(<AddTweet />, {
      wrapper,
    });
    const { result } = renderHook(() => useMedia(), { wrapper });
    const mediaInput = getByTestId('media-import');
    expect(mediaInput).toBeInTheDocument();

    fireEvent.click(getByTestId('add-tweet-container'));
    expect(queryByTestId('media-preview')).not.toBeInTheDocument();
    fireEvent.change(mediaInput, { target: { files: [image1] } });
    expect(queryByTestId('media-preview')).toBeInTheDocument();
    expect(result.current.media.length).toBe(1);
    expect(result.current.media[0].data).toEqual(image1);
    expect(
      getByTestId(`image-${result.current.media[0].id}`)
    ).toBeInTheDocument();
    const submitButton = getByTestId('button-Post');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch).toHaveBeenCalledWith(
      API_CONFIG.BASE_URL + TIMELINE_ENDPOINTS.ADD_TWEET,
      expect.anything()
    );

    expect(result.current.media.length).toBe(0);
  });

  it('try to send post with media exceeded 4 items)', async () => {
    const { getByTestId, queryByTestId } = render(<AddTweet />, {
      wrapper,
    });

    const { result } = renderHook(() => useMedia(), { wrapper });
    renderHook(() => useAddTweet(), { wrapper });
    const mediaInput = getByTestId('media-import');
    expect(mediaInput).toBeInTheDocument();

    const invalidMedia = [image1, image2, image3, image4, image5];
    fireEvent.click(getByTestId('add-tweet-container'));
    expect(queryByTestId('media-preview')).not.toBeInTheDocument();
    fireEvent.change(mediaInput, { target: { files: invalidMedia } });
    expect(result.current.media.length).toBe(0);
    const submitButton = getByTestId('button-Post');

    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    fireEvent.click(submitButton);
    await waitFor(() => expect(global.fetch).not.toHaveBeenCalled());
  });
  it('send post with media and text', async () => {
    const { getByTestId, queryByTestId } = render(<AddTweet />, {
      wrapper,
    });

    const { result } = renderHook(() => useMedia(), { wrapper });
    const { result: resultText } = renderHook(() => useAddTweetStore(), {
      wrapper,
    });
    renderHook(() => useAddTweet(), { wrapper });
    const mediaInput = getByTestId('media-import');
    const validMedia = [image1, image2, image3, image4];

    const submitButton = getByTestId('button-Post');
    fireEvent.change(mediaInput, { target: { files: validMedia } });

    expect(result.current.media.length).toBe(4);
    result.current.media.forEach((media, indx) => {
      expect(media.data).toEqual(validMedia[indx]);
    });
    expect(submitButton).not.toBeDisabled();
    expect(queryByTestId('media-preview')).toBeInTheDocument();
    const inputText = getByTestId('tweet-text-input');
    const text = 'hello X';
    fireEvent.input(inputText, { target: { innerText: text } });
    expect(resultText.current.tweetText).toBe(text);
    fireEvent.click(submitButton);
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        API_CONFIG.BASE_URL + TIMELINE_ENDPOINTS.ADD_TWEET,
        expect.anything()
      )
    );
    expect(resultText.current.tweetText.length).toBe(0);
  });
  it('excced text length to send post', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            status: 'faliure',
            message: 'failed to create post',
          }),
      })
    );
    const { getByTestId } = render(<AddTweet />, {
      wrapper,
    });
    const { result } = renderHook(() => useAddTweetStore(), { wrapper });
    renderHook(() => useAddTweet(), { wrapper });
    const tweetTextInput = getByTestId('tweet-text-input');
    const text = 'hello X';
    fireEvent.input(tweetTextInput, { target: { innerText: text } });
    const redText = getByTestId('tweet-text-overflow');
    expect(redText.innerHTML.length).toBe(0);
    expect(result.current.tweetText).toBe(text);

    const submitButton = getByTestId('button-Post');
    expect(submitButton).not.toBeDisabled();
    const text2 =
      'This is a long test string intended for development, debugging, and validation purposes. It can be used to populate fields, simulate text content, verify rendering, or check how a user interface behaves with a moderately sized block of text. The goal of this sample text is not to deliver meaningful content but to provide a realistic amount of words, characters, and sentence structure similar';
    fireEvent.input(tweetTextInput, { target: { innerText: text2 } });
    expect(submitButton).toBeDisabled();

    expect(redText.innerHTML.length).toBe(
      text2.length - MAX_TWEET_LENGTH - MAX_WARNING_TWEET_LENGTH
    );
  });
});
