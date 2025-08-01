package main

import (
	"fmt"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	rootDirs := []string{"../src/novel/editor"}
	outputFileName := "editor.txt"
	// 定义要屏蔽（不进行递归读取）的目录名称列表。
	excludedDirs := []string{""}

//   	excludedDirs := []string{""}

	// 定义要屏蔽（不读取）的特定文件名列表。
	excludedFiles := []string{".json", "package.json", "pnpm-lock.yaml"}

	if len(os.Args) > 1 {
		rootDirs = os.Args[1:]
	}

	fmt.Printf("准备扫描以下目录: %s\n", strings.Join(rootDirs, ", "))
	fmt.Printf("将跳过以下目录: %s\n", strings.Join(excludedDirs, ", "))
	fmt.Printf("将跳过以下特定文件: %s\n", strings.Join(excludedFiles, ", "))
	fmt.Println("--------------------------------------------------")

	// --- 2. 递归查找所有符合条件的文件，并记录跳过的信息 ---
	var targetFiles []string
	var skippedDirPaths []string
	var skippedFilePaths []string


	for _, rootDir := range rootDirs {
		_, err := os.Stat(rootDir)
		if os.IsNotExist(err) {
			log.Printf("警告: 目录 '%s' 不存在，已跳过。", rootDir)
			continue
		}
		fmt.Printf("正在扫描目录: %s\n", rootDir)

		err = filepath.WalkDir(rootDir, func(path string, d fs.DirEntry, err error) error {
			if err != nil {
				return err
			}

			if d.IsDir() {
				for _, dir := range excludedDirs {
					if d.Name() == dir {
						skippedDirPaths = append(skippedDirPaths, path)
						return filepath.SkipDir
					}
				}
				return nil
			}



			for _, file := range excludedFiles {
				if d.Name() == file {
					skippedFilePaths = append(skippedFilePaths, path)
					return nil
				}
			}
			if strings.HasSuffix(d.Name(), ".ts")||strings.HasSuffix(d.Name(), ".vue")||strings.HasSuffix(d.Name(), ".css")  {
				targetFiles = append(targetFiles, path)
			}
// if strings.HasSuffix(d.Name(), ".vue") {
// 				targetFiles = append(targetFiles, path)
// 			}
			return nil
		})

		if err != nil {
			log.Fatalf("遍历目录 '%s' 时出错: %v", rootDir, err)
		}
	}

	if len(targetFiles) == 0 && len(skippedDirPaths) == 0 && len(skippedFilePaths) == 0 {
		fmt.Println("--------------------------------------------------")
		fmt.Println("扫描完成，没有找到任何目标文件，也没有跳过任何指定的目录或文件。")
		return
	}
	fmt.Println("--------------------------------------------------")
	fmt.Printf("扫描完成，共找到 %d 个目标文件。正在写入到 %s...\n", len(targetFiles), outputFileName)

	// --- 3. 创建并写入输出文件 ---

	outputFile, err := os.Create(outputFileName)
	if err != nil {
		log.Fatalf("创建输出文件 '%s' 失败: %v", outputFileName, err)
	}
	defer outputFile.Close()

	// --- 3.1 写入扫描摘要 ---
	summaryHeader := "// == 扫描摘要 ==\n//\n"
	_, err = outputFile.WriteString(summaryHeader)
	if err != nil {
		log.Fatalf("写入摘要头失败: %v", err)
	}

	if len(skippedDirPaths) > 0 {
		dirHeader := fmt.Sprintf("// 跳过的目录 (共 %d 个):\n", len(skippedDirPaths))
		outputFile.WriteString(dirHeader)
		for _, p := range skippedDirPaths {
			outputFile.WriteString(fmt.Sprintf("//   - %s\n", p))
		}
		outputFile.WriteString("//\n")
	}



	if len(skippedFilePaths) > 0 {
		fileHeader := fmt.Sprintf("// 跳过的特定文件 (共 %d 个):\n", len(skippedFilePaths))
		outputFile.WriteString(fileHeader)
		for _, p := range skippedFilePaths {
			outputFile.WriteString(fmt.Sprintf("//   - %s\n", p))
		}
		outputFile.WriteString("//\n")
	}

	contentSeparator := "// == 文件内容 ==\n\n"
	_, err = outputFile.WriteString(contentSeparator)
	if err != nil {
		log.Fatalf("写入内容分隔符失败: %v", err)
	}

	// --- 4. 遍历文件列表，读取内容并写入输出文件 ---
	for _, filePath := range targetFiles {
		header := fmt.Sprintf("// =\n// 文件: %s\n//\n\n", filePath)
		_, err := outputFile.WriteString(header)
		if err != nil {
			log.Fatalf("写入文件头到 '%s' 失败: %v", outputFileName, err)
		}

		content, err := os.ReadFile(filePath)
		if err != nil {
			log.Printf("警告: 读取文件 '%s' 失败，已跳过: %v\n", filePath, err)
			continue
		}

		_, err = outputFile.Write(content)
		if err != nil {
			log.Fatalf("写入文件内容到 '%s' 失败: %v", outputFileName, err)
		}

		_, err = outputFile.WriteString("\n\n")
		if err != nil {
			log.Fatalf("写入换行符到 '%s' 失败: %v", outputFileName, err)
		}
	}

	fmt.Printf("成功！所有信息已合并到 %s\n", outputFileName)
}
