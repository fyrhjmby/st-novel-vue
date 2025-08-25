import * as volumeApi from '@/novel/editor/api/volumeApi';
import * as chapterApi from '@/novel/editor/api/chapterApi';
import type { Volume, Chapter } from '@/novel/editor/types';

export const getDirectoryData = async (novelId: string): Promise<Volume[]> => {
    const [volumes, chapters] = await Promise.all([
        volumeApi.getVolumes(novelId),
        chapterApi.getChaptersForNovel(novelId),
    ]);

    const volumeMap = new Map(volumes.map(v => [v.id, { ...v, chapters: [] as Chapter[] }]));
    chapters.forEach(chapter => {
        const volume = volumeMap.get(chapter.volumeId);
        if (volume) {
            volume.chapters.push(chapter);
        }
    });

    const sortedVolumes = Array.from(volumeMap.values()).sort((a, b) => a.order - b.order);
    sortedVolumes.forEach(volume => {
        volume.chapters.sort((a, b) => a.order - b.order);
    });

    return sortedVolumes;
};

export const saveDirectoryData = async (novelId: string, volumes: Volume[]): Promise<void> => {
    const savePromises: Promise<any>[] = [];

    const orderedVolumeIds = volumes.map((v, index) => {
        savePromises.push(volumeApi.updateVolume(v.id, { title: v.title, content: v.content, order: index }));
        v.chapters.forEach((c, cIndex) => {
            savePromises.push(chapterApi.updateChapter(c.id, { title: c.title, content: c.content, status: c.status, order: cIndex }));
        });
        const orderedChapterIds = v.chapters.map(c => c.id);
        savePromises.push(chapterApi.updateChapterOrder(v.id, orderedChapterIds));
        return v.id;
    });

    savePromises.push(volumeApi.updateVolumeOrder(novelId, orderedVolumeIds));

    await Promise.all(savePromises);
};

export const createVolume = (novelId: string, volumeData: Partial<Omit<Volume, 'id' | 'chapters'>>): Promise<Volume> => {
    return volumeApi.createVolume(novelId, volumeData);
};

export const deleteVolume = (volumeId: string): Promise<void> => {
    return volumeApi.deleteVolume(volumeId);
};

export const createChapter = (volumeId: string, chapterData: Partial<Omit<Chapter, 'id'>>): Promise<Chapter> => {
    return chapterApi.createChapter(volumeId, chapterData);
};

export const deleteChapter = (chapterId: string): Promise<void> => {
    return chapterApi.deleteChapter(chapterId);
};